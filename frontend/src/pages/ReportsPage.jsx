import { useState, useEffect } from 'react';
import { reportsApi, activitiesApi } from '../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const WEATHER_OPTIONS = ['Soleado', 'Nublado', 'Lluvioso', 'Viento fuerte', 'Niebla', 'Tormenta'];

function DailyReport() {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [form, setForm] = useState({
    planned_works: '', executed_works: '', incidents: '',
    consumed_materials: '', needed_materials: '', machinery: '',
    personnel: 0, weather: 'Soleado'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    reportsApi.getDaily(date).then(data => {
      if (data && data.id) setForm({ ...form, ...data });
      else setForm({ planned_works: '', executed_works: '', incidents: '', consumed_materials: '', needed_materials: '', machinery: '', personnel: 0, weather: 'Soleado' });
    }).catch(() => {});
  }, [date]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    await reportsApi.saveDaily({ ...form, date });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function generatePDF() {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(30, 64, 175);
    doc.text('INFORME DIARIO DE OBRA', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Túnel Yébenes | Fecha: ${date}`, 14, 30);
    doc.text(`Meteorología: ${form.weather} | Personal en obra: ${form.personnel} personas`, 14, 38);

    const rows = [
      ['Trabajos previstos', form.planned_works || '—'],
      ['Trabajos ejecutados', form.executed_works || '—'],
      ['Incidencias', form.incidents || 'Sin incidencias'],
      ['Materiales consumidos', form.consumed_materials || '—'],
      ['Materiales para mañana', form.needed_materials || '—'],
      ['Maquinaria utilizada', form.machinery || '—'],
    ];

    autoTable(doc, {
      startY: 45,
      head: [['Concepto', 'Detalle']],
      body: rows,
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [30, 64, 175], textColor: 255 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 55 } },
    });

    doc.save(`informe-diario-${date}.pdf`);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Fecha del informe</label>
          <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={date} onChange={e => setDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Meteorología</label>
          <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.weather} onChange={e => set('weather', e.target.value)}>
            {WEATHER_OPTIONS.map(w => <option key={w}>{w}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Personal en obra</label>
          <input type="number" min="0"
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm w-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={form.personnel} onChange={e => set('personnel', +e.target.value)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: 'planned_works', label: '📋 Trabajos previstos' },
          { key: 'executed_works', label: '✅ Trabajos ejecutados' },
          { key: 'incidents', label: '⚠️ Incidencias' },
          { key: 'consumed_materials', label: '📦 Materiales consumidos' },
          { key: 'needed_materials', label: '🔜 Materiales para mañana' },
          { key: 'machinery', label: '🚜 Maquinaria utilizada' },
        ].map(({ key, label }) => (
          <div key={key}>
            <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
            <textarea rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={form[key]} onChange={e => set(key, e.target.value)}
              placeholder="Describe aquí..." />
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={handleSave} className="btn-primary flex items-center gap-2">
          {saved ? '✓ Guardado' : 'Guardar informe'}
        </button>
        <button onClick={generatePDF} className="btn-secondary flex items-center gap-2">
          📥 Exportar PDF
        </button>
      </div>
    </div>
  );
}

function WeeklyReport() {
  const [weekStart, setWeekStart] = useState('2026-05-11');
  const [weekEnd, setWeekEnd] = useState('2026-05-17');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  async function analyze() {
    setLoading(true);
    try {
      const data = await reportsApi.analyzeWeekly({ week_start: weekStart, week_end: weekEnd });
      setAnalysis(data);
    } finally {
      setLoading(false);
    }
  }

  function generatePDF() {
    if (!analysis) return;
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.setTextColor(30, 64, 175);
    doc.text('INFORME SEMANAL — ANÁLISIS IA', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(`Semana: ${weekStart} → ${weekEnd}`, 14, 30);
    doc.text(`Total actividades: ${analysis.summary.total_activities} | Completadas: ${analysis.summary.completed} | Retrasadas: ${analysis.summary.delayed}`, 14, 38);
    doc.text(`Avance medio: ${analysis.summary.avg_progress}%`, 14, 46);

    if (analysis.deviations.length > 0) {
      autoTable(doc, {
        startY: 54,
        head: [['Actividad', 'Problema', 'Progreso Real', 'Desviación']],
        body: analysis.deviations.map(d => [d.activity.substring(0, 40), d.issue, `${d.real_progress}%`, `${d.deviation}%`]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [239, 68, 68] },
      });
    }

    const lastY = doc.lastAutoTable?.finalY || 60;
    autoTable(doc, {
      startY: lastY + 10,
      head: [['Recomendaciones de la IA']],
      body: analysis.recommendations.map(r => [r]),
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [30, 64, 175], textColor: 255 },
    });

    doc.save(`informe-semanal-${weekStart}.pdf`);
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Semana inicio</label>
          <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={weekStart} onChange={e => setWeekStart(e.target.value)} />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Semana fin</label>
          <input type="date" className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={weekEnd} onChange={e => setWeekEnd(e.target.value)} />
        </div>
        <div className="mt-5">
          <button onClick={analyze} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? '⟳ Analizando...' : '🤖 Analizar semana con IA'}
          </button>
        </div>
      </div>

      {analysis && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: 'Total actividades', value: analysis.summary.total_activities, color: 'text-slate-700' },
              { label: 'Completadas', value: analysis.summary.completed, color: 'text-green-600' },
              { label: 'Retrasadas', value: analysis.summary.delayed, color: 'text-red-600' },
              { label: 'Avance medio', value: `${analysis.summary.avg_progress}%`, color: 'text-blue-600' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card text-center">
                <div className={`text-3xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>

          {/* Deviations */}
          {analysis.deviations.length > 0 ? (
            <div className="card border-l-4 border-orange-400">
              <h3 className="font-semibold text-orange-700 mb-3">⚠️ Desviaciones detectadas</h3>
              <div className="space-y-2">
                {analysis.deviations.map((d, i) => (
                  <div key={i} className="bg-orange-50 rounded-lg p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800 truncate flex-1">{d.activity}</span>
                      <span className="text-sm font-bold text-red-600 ml-2">{d.deviation}%</span>
                    </div>
                    <p className="text-xs text-orange-600 mt-0.5">{d.issue} · Progreso real: {d.real_progress}%</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="card border-l-4 border-green-400">
              <p className="text-green-700 font-medium">✅ Sin desviaciones significativas esta semana</p>
            </div>
          )}

          {/* Recommendations */}
          {analysis.recommendations.length > 0 && (
            <div className="card border-l-4 border-blue-500">
              <h3 className="font-semibold text-blue-700 mb-3">🤖 Recomendaciones IA</h3>
              <ul className="space-y-2">
                {analysis.recommendations.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                    <span className="text-blue-500 font-bold mt-0.5">{i + 1}.</span>
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button onClick={generatePDF} className="btn-secondary flex items-center gap-2">
            📥 Exportar informe semanal PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default function ReportsPage() {
  const [tab, setTab] = useState('daily');

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Informes</h1>
        <p className="text-slate-500 text-sm">Diario manual + análisis semanal con IA</p>
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {[
          { id: 'daily', label: '📋 Informe Diario' },
          { id: 'weekly', label: '🤖 Informe Semanal IA' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === t.id ? 'border-blue-600 text-blue-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="card">
        {tab === 'daily' ? <DailyReport /> : <WeeklyReport />}
      </div>
    </div>
  );
}
