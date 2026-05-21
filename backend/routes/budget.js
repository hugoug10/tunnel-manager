const express = require('express');
const router = express.Router();
const db = require('../database');

// ── CATÁLOGO DE MATERIALES ──────────────────────────────────────────────────

router.get('/catalog', (req, res) => {
  res.json(db.get('catalog').value());
});

router.post('/catalog', (req, res) => {
  const id = db.nextId('catalog');
  const item = { id, ...req.body, updated_at: new Date().toISOString().split('T')[0] };
  db.get('catalog').push(item).write();
  res.json({ id });
});

router.put('/catalog/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const old = db.get('catalog').find({ id }).value();
  if (old && old.price !== req.body.price) {
    const hid = db.nextId('price_history');
    db.get('material_prices_history').push({ id: hid, material_id: id, price: req.body.price, date: new Date().toISOString().split('T')[0], note: 'Actualización manual' }).write();
  }
  db.get('catalog').find({ id }).assign({ ...req.body, updated_at: new Date().toISOString().split('T')[0] }).write();
  res.json({ success: true });
});

router.delete('/catalog/:id', (req, res) => {
  db.get('catalog').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

// ── PROVEEDORES ─────────────────────────────────────────────────────────────

router.get('/suppliers', (req, res) => {
  res.json(db.get('suppliers').value());
});

router.post('/suppliers', (req, res) => {
  const id = db.nextId('suppliers');
  db.get('suppliers').push({ id, ...req.body }).write();
  res.json({ id });
});

router.put('/suppliers/:id', (req, res) => {
  db.get('suppliers').find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.json({ success: true });
});

// ── PARTIDAS PRESUPUESTARIAS ─────────────────────────────────────────────────

router.get('/items', (req, res) => {
  const items = db.get('budget_items').value();
  const catalog = db.get('catalog').value();
  const activities = db.get('activities').value();
  const enriched = items.map(item => {
    const act = activities.find(a => a.id === item.activity_id) || {};
    const mat = catalog.find(m => m.id === item.material_id) || {};
    return {
      ...item,
      activity_name: act.name || '—',
      material_name: mat.name || '—',
      cost_planned: item.qty_planned * item.unit_price,
      cost_real: item.qty_real * item.unit_price,
      deviation_pct: item.qty_planned > 0
        ? Math.round(((item.qty_real - item.qty_planned) / item.qty_planned) * 100)
        : 0,
    };
  });
  res.json(enriched);
});

router.post('/items', (req, res) => {
  const id = db.nextId('budget_items');
  db.get('budget_items').push({ id, ...req.body, created_at: new Date().toISOString() }).write();
  res.json({ id });
});

router.put('/items/:id', (req, res) => {
  db.get('budget_items').find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.json({ success: true });
});

router.delete('/items/:id', (req, res) => {
  db.get('budget_items').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

// ── RESUMEN ECONÓMICO ────────────────────────────────────────────────────────

router.get('/summary', (req, res) => {
  const items = db.get('budget_items').value();
  const activities = db.get('activities').value();

  const total_planned = items.reduce((s, i) => s + i.qty_planned * i.unit_price, 0);
  const total_real    = items.reduce((s, i) => s + i.qty_real * i.unit_price, 0);
  const deviation     = total_real - total_planned;
  const deviation_pct = total_planned > 0 ? (deviation / total_planned) * 100 : 0;

  // Coste por actividad
  const by_activity = activities.map(act => {
    const actItems = items.filter(i => i.activity_id === act.id);
    const planned  = actItems.reduce((s, i) => s + i.qty_planned * i.unit_price, 0);
    const real     = actItems.reduce((s, i) => s + i.qty_real * i.unit_price, 0);
    return { id: act.id, name: act.name, planned, real, deviation: real - planned, progress: act.progress };
  }).filter(a => a.planned > 0);

  // Progreso financiero global
  const financial_progress = total_planned > 0 ? Math.round((total_real / total_planned) * 100) : 0;
  const remaining = total_planned - total_real;

  // Mock weekly series (últimas 6 semanas)
  const weekly = [
    { week: 'S1 Abr', planned: 45200, real: 43800 },
    { week: 'S2 Abr', planned: 48600, real: 51200 },
    { week: 'S3 Abr', planned: 52300, real: 55100 },
    { week: 'S4 Abr', planned: 47800, real: 49300 },
    { week: 'S1 May', planned: 51200, real: 48900 },
    { week: 'S2 May', planned: 49500, real: 0 },
  ];

  const monthly = [
    { month: 'Enero',   planned: 0,      real: 0      },
    { month: 'Febrero', planned: 0,      real: 0      },
    { month: 'Marzo',   planned: 38000,  real: 35200  },
    { month: 'Abril',   planned: 193900, real: 199400 },
    { month: 'Mayo',    planned: 215000, real: 48900  },
  ];

  res.json({
    total_planned, total_real, deviation, deviation_pct,
    financial_progress, remaining,
    by_activity, weekly, monthly,
  });
});

// ── PRECIO HISTÓRICO ─────────────────────────────────────────────────────────

router.get('/price-history/:material_id', (req, res) => {
  const history = db.get('material_prices_history')
    .filter({ material_id: parseInt(req.params.material_id) })
    .sortBy('date').value();
  res.json(history);
});

// ── ANÁLISIS IA ───────────────────────────────────────────────────────────────

router.get('/ai-analysis', (req, res) => {
  const items    = db.get('budget_items').value();
  const catalog  = db.get('catalog').value();
  const history  = db.get('material_prices_history').value();

  const alerts = [];

  items.forEach(item => {
    if (item.qty_planned === 0) return;
    const deviation_pct = ((item.qty_real - item.qty_planned) / item.qty_planned) * 100;
    if (deviation_pct > 10) {
      alerts.push({ type: 'overrun', severity: 'high',
        message: `Sobreconsumo del ${deviation_pct.toFixed(1)}% en "${item.description}"`,
        recommendation: 'Revisar rendimientos y reducir desperdicio' });
    }
  });

  // Price increase alerts
  const matIds = [...new Set(history.map(h => h.material_id))];
  matIds.forEach(mid => {
    const prices = history.filter(h => h.material_id === mid).sort((a, b) => a.date.localeCompare(b.date));
    if (prices.length >= 2) {
      const first = prices[0].price;
      const last  = prices[prices.length - 1].price;
      const pct   = ((last - first) / first) * 100;
      if (pct > 5) {
        const mat = catalog.find(m => m.id === mid);
        alerts.push({ type: 'price_rise', severity: 'medium',
          message: `${mat?.name} ha subido un ${pct.toFixed(1)}% desde inicio de obra`,
          recommendation: 'Solicitar presupuesto alternativo a otros proveedores' });
      }
    }
  });

  // Mock fixed insights
  alerts.push(
    { type: 'optimization', severity: 'low',
      message: 'La actividad de Gunitado genera sobrecostes por rendimiento inferior al previsto',
      recommendation: 'Aumentar equipo de proyección o revisar dosificación' },
    { type: 'optimization', severity: 'low',
      message: 'Se detecta stock excesivo de zahorra en acopio',
      recommendation: 'Reorganizar suministros: pedir bajo demanda para reducir coste de almacén' }
  );

  const recommendations = [
    'Negociar contrato marco con Holcim para hormigón: ahorro estimado 4-6%',
    'Agrupar pedidos de acero para volumen >10T y obtener descuento proveedor',
    'Revisar mermas en gunitado: pérdida estimada 12% superior a media',
    'Adelantar compra de tubería de drenaje antes de próxima revisión de precios',
  ];

  res.json({ alerts, recommendations });
});

module.exports = router;
