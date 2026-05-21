const express = require('express');
const router  = express.Router();
const db      = require('../database');

// ── Predicción de retrasos ───────────────────────────────────────────────────
router.get('/prediccion', (req, res) => {
  const activities = db.get('activities').value();
  const today = new Date();

  const predictions = activities.map(act => {
    const planned_end  = new Date(act.end_date);
    const planned_start = new Date(act.start_date);
    const progress = act.progress || 0;

    if (act.status === 'completed') {
      return { ...act, predicted_end: act.real_end || act.end_date, delay_days: 0, risk: 'none', explanation: 'Completada' };
    }
    if (act.status === 'pending') {
      return { ...act, predicted_end: act.end_date, delay_days: 0, risk: 'low', explanation: 'No iniciada' };
    }

    // Calculate predicted end based on current burn rate
    const elapsed_days = Math.max(1, Math.floor((today - planned_start) / 86400000));
    const burn_rate    = progress / elapsed_days; // % per day
    const remaining    = 100 - progress;
    const days_needed  = burn_rate > 0 ? Math.ceil(remaining / burn_rate) : act.duration;
    const predicted_end_date = new Date(today);
    predicted_end_date.setDate(predicted_end_date.getDate() + days_needed);

    const delay_days = Math.max(0, Math.floor((predicted_end_date - planned_end) / 86400000));
    const risk = delay_days === 0 ? 'low' : delay_days <= 5 ? 'medium' : 'high';
    const explanation = burn_rate > 0
      ? `Rendimiento actual: ${burn_rate.toFixed(1)}%/día. Faltan ~${days_needed} días.`
      : 'Sin datos de rendimiento suficientes.';

    return {
      id: act.id, name: act.name, status: act.status, progress,
      planned_end: act.end_date, predicted_end: predicted_end_date.toISOString().split('T')[0],
      delay_days, risk, explanation, is_critical: act.is_critical
    };
  });

  const total_delay = predictions.reduce((s, p) => s + p.delay_days, 0);
  const high_risk   = predictions.filter(p => p.risk === 'high');

  // Global finish prediction
  const maxDelay = Math.max(...predictions.map(p => p.delay_days));
  const globalEnd = new Date('2026-05-31');
  globalEnd.setDate(globalEnd.getDate() + maxDelay);

  res.json({
    predictions,
    summary: {
      total_delay_avg: Math.round(total_delay / predictions.length),
      high_risk_count: high_risk.length,
      predicted_global_end: globalEnd.toISOString().split('T')[0],
      planned_global_end: '2026-05-31',
      global_delay: maxDelay,
    }
  });
});

// ── Optimizador de recursos ──────────────────────────────────────────────────
router.get('/optimizador', (req, res) => {
  const activities   = db.get('activities').value();
  const machinery    = db.get('machinery_logs').value();
  const delayed      = activities.filter(a => a.status === 'delayed' || (a.progress < 50 && a.status === 'in_progress'));
  const critical     = activities.filter(a => a.is_critical === 1 && a.status !== 'completed');

  const suggestions = [];

  delayed.forEach(act => {
    const deviation = 100 - (act.progress || 0);
    if (deviation > 30) {
      suggestions.push({ priority: 'high', activity: act.name, action: 'Aumentar cuadrilla', detail: `Déficit del ${deviation}%. Añadir 2-3 operarios especializados para recuperar ritmo.`, saving: `~${Math.round(deviation * 0.4)} días de retraso` });
    } else {
      suggestions.push({ priority: 'medium', activity: act.name, action: 'Ampliar jornada', detail: 'Extender jornada a 10h/día durante 1 semana para recuperar desfase.', saving: `~${Math.round(deviation * 0.2)} días` });
    }
  });

  critical.forEach(act => {
    if (act.status === 'pending') {
      const startDate = new Date(act.start_date);
      const daysUntil = Math.floor((startDate - new Date()) / 86400000);
      if (daysUntil < 7) {
        suggestions.push({ priority: 'high', activity: act.name, action: 'Adelantar suministros', detail: `Actividad crítica en ${Math.max(0,daysUntil)} días. Confirmar materiales y maquinaria ahora.`, saving: 'Evita parada de obra' });
      }
    }
  });

  // Machinery optimization
  const machineHours = Object.values(machinery.reduce((acc, l) => {
    if (!acc[l.machine]) acc[l.machine] = { machine: l.machine, total_hours: 0, days: 0 };
    acc[l.machine].total_hours += l.hours; acc[l.machine].days++;
    return acc;
  }, {}));

  machineHours.forEach(m => {
    const avg = m.total_hours / m.days;
    if (avg < 6) suggestions.push({ priority: 'low', activity: 'Maquinaria general', action: 'Optimizar uso de maquinaria', detail: `${m.machine}: media ${avg.toFixed(1)}h/día. Reasignar o devolver para reducir coste de alquiler.`, saving: `~${Math.round((8 - avg) * 45)}€/día` });
  });

  if (suggestions.length === 0) suggestions.push({ priority: 'low', activity: 'Global', action: 'Mantenimiento del ritmo', detail: 'Obra dentro de parámetros. Mantener planificación actual.', saving: 'Sin acciones urgentes' });

  res.json({ suggestions, delayed_count: delayed.length, critical_pending: critical.filter(a => a.status === 'pending').length });
});

// ── Chat con la obra ─────────────────────────────────────────────────────────
router.post('/chat', (req, res) => {
  const { message } = req.body;
  const q = (message || '').toLowerCase();
  const activities   = db.get('activities').value();
  const budget_items = db.get('budget_items').value();
  const safety       = db.get('safety_incidents').value();
  const machinery    = db.get('machinery_logs').value();
  const quality      = db.get('quality_tests').value();

  let answer = '';

  // Avance / progreso
  if (q.match(/avance|progreso|porcentaje|completado/)) {
    const avg = Math.round(activities.reduce((s, a) => s + (a.progress || 0), 0) / activities.length);
    const completed = activities.filter(a => a.status === 'completed').length;
    answer = `El avance global de la obra es del **${avg}%**. Hay **${completed} actividades completadas** de ${activities.length} totales.`;

  // Retrasos
  } else if (q.match(/retraso|retrasad|fuera de plazo/)) {
    const delayed = activities.filter(a => a.status === 'delayed');
    if (delayed.length === 0) answer = 'No hay actividades en estado retrasado actualmente.';
    else answer = `Hay **${delayed.length} actividad(es) retrasada(s)**:\n${delayed.map(a => `• ${a.name}`).join('\n')}`;

  // Hormigón / materiales
  } else if (q.match(/hormig[oó]n|concreto/)) {
    const items = budget_items.filter(i => i.description.toLowerCase().includes('hormigón'));
    const total_planned = items.reduce((s, i) => s + i.qty_planned, 0);
    const total_real    = items.reduce((s, i) => s + i.qty_real, 0);
    answer = `Hormigón consumido: **${total_real.toFixed(0)} m³** de **${total_planned.toFixed(0)} m³** planificados (${total_planned > 0 ? Math.round((total_real/total_planned)*100) : 0}%).`;

  // Ferralla / acero
  } else if (q.match(/ferralla|acero|armado/)) {
    const items = budget_items.filter(i => i.description.toLowerCase().includes('ferralla'));
    const total_real = items.reduce((s, i) => s + i.qty_real, 0);
    const total_plan = items.reduce((s, i) => s + i.qty_planned, 0);
    answer = `Ferralla colocada: **${total_real.toFixed(0)} kg** de **${total_plan.toFixed(0)} kg** previstos.`;

  // Seguridad / accidentes
  } else if (q.match(/seguridad|accidente|incidencia|herido/)) {
    const acc = safety.filter(i => i.type === 'accidente').length;
    const casi = safety.filter(i => i.type === 'casi-accidente').length;
    const injured = safety.filter(i => i.injured).length;
    answer = `Seguridad: **${acc} accidente(s)**, **${casi} casi-accidente(s)**. Personas lesionadas: **${injured}**. Total incidencias registradas: ${safety.length}.`;

  // Maquinaria
  } else if (q.match(/maquinaria|excavadora|máquina|volquete|horas/)) {
    const total_hours = machinery.reduce((s, l) => s + (l.hours || 0), 0);
    const breakdowns  = machinery.filter(l => l.status === 'avería').length;
    answer = `Maquinaria: **${total_hours.toFixed(0)} horas** trabajadas en total. **${breakdowns} avería(s)** registradas.`;

  // Calidad / ensayos
  } else if (q.match(/calidad|ensayo|probeta|rotura/)) {
    const passed = quality.filter(t => t.status === 'ok').length;
    const failed = quality.filter(t => t.status === 'nok').length;
    answer = `Ensayos de calidad: **${passed} aprobados**, **${failed} no conformes** de ${quality.length} totales. Tasa de éxito: ${Math.round((passed/quality.length)*100)}%.`;

  // Coste / presupuesto
  } else if (q.match(/coste|costo|presupuesto|gasto|dinero/)) {
    const total_plan = budget_items.reduce((s, i) => s + i.qty_planned * i.unit_price, 0);
    const total_real = budget_items.reduce((s, i) => s + i.qty_real * i.unit_price, 0);
    const pct = total_plan > 0 ? Math.round((total_real/total_plan)*100) : 0;
    answer = `Coste ejecutado: **${total_real.toLocaleString('es-ES', {style:'currency',currency:'EUR',maximumFractionDigits:0})}** de **${total_plan.toLocaleString('es-ES', {style:'currency',currency:'EUR',maximumFractionDigits:0})}** presupuestados (${pct}%).`;

  // Actividades en curso
  } else if (q.match(/activ|trabaj|ejecut|curso/)) {
    const inProgress = activities.filter(a => a.status === 'in_progress');
    answer = `Actividades en curso: **${inProgress.length}**:\n${inProgress.map(a => `• ${a.name} (${a.progress}%)`).join('\n')}`;

  // Próximas actividades
  } else if (q.match(/próxim|siguiente|empiez|comienz/)) {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = activities.filter(a => a.start_date >= today && a.status === 'pending').sort((a,b) => a.start_date.localeCompare(b.start_date)).slice(0,3);
    if (upcoming.length === 0) answer = 'No hay actividades pendientes próximas.';
    else answer = `Próximas actividades:\n${upcoming.map(a => `• **${a.name}** — Inicio: ${a.start_date}`).join('\n')}`;

  } else {
    answer = `No he encontrado datos específicos para esa consulta. Puedes preguntarme sobre:\n• Avance global\n• Actividades retrasadas\n• Consumo de hormigón o ferralla\n• Seguridad e incidencias\n• Maquinaria y horas\n• Calidad y ensayos\n• Costes y presupuesto\n• Próximas actividades`;
  }

  res.json({ question: message, answer, timestamp: new Date().toISOString() });
});

module.exports = router;
