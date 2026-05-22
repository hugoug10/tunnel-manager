import { useState, useEffect } from 'react';
import axios from 'axios';

const STATUS_COLORS = { ok: 'bg-green-100 text-green-700', nok: 'bg-red-100 text-red-700', pendiente: 'bg-amber-100 text-amber-700' };
const STATUS_ICONS  = { ok: '✅', nok: '❌', pendiente: '⏳' };

const EMPTY_FORM = { date: new Date().toISOString().split('T')[0], type: 'Probeta hormigón', location: '', result: '', min_value: '', unit: 'MPa', notes: '' };

export default function CalidadPage() {
  const [tests, setTests]     = useState([]);
  const [stats, setStats]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [filter, setFilter]   = useState('todos');

  const load = async () => {
    const [t, s] = await Promise.all([axios.get('/api/calidad'), axios.get('/api/calidad/stats')]);
    setTests(t.data);
    setStats(s.data);
  };
  useEffect(() => { load(); }, []);

  const filtered = filter === 'todos' ? tests : tests.filter(t => t.status === filter);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/calidad', { ...form, result: parseFloat(form.result), min_value: parseFloat(form.min_value) });
      await load();
      setShowForm(false);
      setForm(EMPTY_FORM);
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar ensayo?')) return;
    await axios.delete(`/api/calidad/${id}`);
    load();
  }

  const passRate = stats ? Math.round((stats.passed / (stats.total || 1)) * 100) : 0;

  return (
    <div className="p-4 md:p-6 space-y-5 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Control de Calidad</h1>
          <p className="text-slate-500 text-sm">{tests.length} ensayos registrados · Tasa de aprobación: {passRate}%</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary">+ Nuevo ensayo</button>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-3xl font-bold text-slate-800">{stats.total}</p>
            <p className="text-xs text-slate-500 mt-1">Total ensayos</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-green-600">{stats.passed}</p>
            <p className="text-xs text-slate-500 mt-1">Conformes</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
            <p className="text-xs text-slate-500 mt-1">No conformes</p>
          </div>
          <div className="card text-center">
            <div className="relative inline-flex items-center justify-center w-16 h-16 mx-auto mb-1">
              <svg className="w-16 h-16 -rotate-90" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="22" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                <circle cx="28" cy="28" r="22" fill="none" stroke={passRate >= 90 ? '#16a34a' : passRate >= 70 ? '#f59e0b' : '#dc2626'}
                  strokeWidth="6" strokeDasharray={`${(passRate / 100) * 138.2} 138.2`} strokeLinecap="round" />
              </svg>
              <span className="absolute text-sm font-bold text-slate-700">{passRate}%</span>
            </div>
            <p className="text-xs text-slate-500">Tasa aprobación</p>
          </div>
        </div>
      )}

      {/* AI Alerts */}
      {stats?.ai_alerts?.length > 0 && (
        <div className="space-y-2">
          {stats.ai_alerts.map((a, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm ${a.type === 'alert' ? 'bg-red-50 border border-red-200 text-red-800' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
              <span className="mt-0.5">{a.type === 'alert' ? '🚨' : '⚠️'}</span>
              <span>{a.msg}</span>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card border-blue-200 border">
          <h3 className="font-semibold text-slate-700 mb-4">Registrar nuevo ensayo</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Fecha</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tipo de ensayo</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
                {['Probeta hormigón','Ensayo compactación','Resistencia acero','Impermeabilidad','Granulometría'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ubicación</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="Pk 0+250, Sección 3..." required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Resultado</label>
              <input type="number" step="0.1" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.result} onChange={e => setForm(f => ({...f, result: e.target.value}))} placeholder="25.4" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Valor mínimo</label>
              <input type="number" step="0.1" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.min_value} onChange={e => setForm(f => ({...f, min_value: e.target.value}))} placeholder="25.0" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Unidad</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.unit} onChange={e => setForm(f => ({...f, unit: e.target.value}))}>
                {['MPa','kN/m²','%','kg/m³'].map(u => <option key={u}>{u}</option>)}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-600 mb-1">Notas</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Observaciones del ensayo..." />
            </div>
            <div className="md:col-span-3 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Guardando...' : 'Guardar ensayo'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {[['todos','Todos'], ['ok','Conformes'], ['nok','No conformes'], ['pendiente','Pendientes']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === val ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Fecha','Tipo','Ubicación','Resultado','Mín.','Estado','Notas',''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(t => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3 text-slate-600">{t.date}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{t.type}</td>
                <td className="px-4 py-3 text-slate-600">{t.location}</td>
                <td className="px-4 py-3 font-semibold text-slate-800">{t.result} {t.unit}</td>
                <td className="px-4 py-3 text-slate-500">{t.min_value} {t.unit}</td>
                <td className="px-4 py-3">
                  <span className={`badge ${STATUS_COLORS[t.status] || 'bg-slate-100 text-slate-600'}`}>
                    {STATUS_ICONS[t.status]} {t.status === 'ok' ? 'Conforme' : t.status === 'nok' ? 'No conforme' : 'Pendiente'}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs max-w-xs truncate">{t.notes}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(t.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all text-xs">✕</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">No hay ensayos en esta categoría</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
