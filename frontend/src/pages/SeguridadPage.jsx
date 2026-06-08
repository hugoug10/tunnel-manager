import { useState, useEffect } from 'react';
import axios from 'axios';

const TYPE_COLORS = { accidente: 'bg-red-100 text-red-700', 'casi-accidente': 'bg-amber-100 text-amber-700', inspección: 'bg-blue-100 text-blue-700' };
const SEV_COLORS  = { high: 'bg-red-100 text-red-700', medium: 'bg-amber-100 text-amber-700', low: 'bg-green-100 text-green-700' };
const SEV_LABELS  = { high: 'Alta', medium: 'Media', low: 'Baja' };
const EMPTY_FORM  = { date: new Date().toISOString().split('T')[0], type: 'casi-accidente', location: '', description: '', severity: 'medium', injured: false, corrective_action: '', status: 'abierta' };

export default function SeguridadPage() {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats]         = useState(null);
  const [showForm, setShowForm]   = useState(false);
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);
  const [filter, setFilter]       = useState('todos');
  const [selected, setSelected]   = useState(null);

  const load = async () => {
    const [inc, s] = await Promise.all([axios.get('/api/seguridad'), axios.get('/api/seguridad/stats')]);
    setIncidents(inc.data);
    setStats(s.data);
  };
  useEffect(() => { load(); }, []);

  const filtered = filter === 'todos' ? incidents : incidents.filter(i => i.type === filter || i.status === filter);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/seguridad', form);
      await load();
      setShowForm(false);
      setForm(EMPTY_FORM);
    } finally { setSaving(false); }
  }

  async function handleClose(id) {
    await axios.put(`/api/seguridad/${id}`, { status: 'cerrada' });
    load();
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar incidencia?')) return;
    await axios.delete(`/api/seguridad/${id}`);
    load();
  }

  const INSIGHT_ICONS = { pattern: '🔍', alert: '🚨', pending: '⏳', kpi: '📊' };
  const INSIGHT_STYLES = { pattern: 'bg-blue-50 border-blue-200 text-blue-800', alert: 'bg-red-50 border-red-200 text-red-800', pending: 'bg-amber-50 border-amber-200 text-amber-800', kpi: 'bg-slate-50 border-slate-200 text-slate-700' };

  return (
    <div className="p-4 md:p-6 space-y-5 overflow-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Seguridad y Salud</h1>
          <p className="text-slate-500 text-sm">{incidents.length} incidencias · Plan de seguridad obra</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary self-start sm:self-auto">+ Registrar incidencia</button>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center border-l-4 border-red-500">
            <p className="text-3xl font-bold text-red-600">{stats.accidentes}</p>
            <p className="text-xs text-slate-500 mt-1">Accidentes</p>
          </div>
          <div className="card text-center border-l-4 border-amber-500">
            <p className="text-3xl font-bold text-amber-600">{stats.casi}</p>
            <p className="text-xs text-slate-500 mt-1">Casi-accidentes</p>
          </div>
          <div className="card text-center border-l-4 border-blue-500">
            <p className="text-3xl font-bold text-blue-600">{stats.inspecciones}</p>
            <p className="text-xs text-slate-500 mt-1">Inspecciones</p>
          </div>
          <div className="card text-center border-l-4 border-slate-500">
            <p className="text-3xl font-bold text-slate-700">{stats.open}</p>
            <p className="text-xs text-slate-500 mt-1">Abiertas</p>
          </div>
        </div>
      )}

      {/* AI Insights */}
      {stats?.ai_insights?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {stats.ai_insights.map((ins, i) => (
            <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl text-sm border ${INSIGHT_STYLES[ins.type] || INSIGHT_STYLES.kpi}`}>
              <span className="mt-0.5 shrink-0">{INSIGHT_ICONS[ins.type] || '💡'}</span>
              <span>{ins.msg}</span>
            </div>
          ))}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card border-red-200 border">
          <h3 className="font-semibold text-slate-700 mb-4">Registrar incidencia de seguridad</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Fecha</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tipo</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
                {['accidente','casi-accidente','inspección'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Gravedad</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.severity} onChange={e => setForm(f => ({...f, severity: e.target.value}))}>
                {[['low','Baja'],['medium','Media'],['high','Alta']].map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ubicación</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.location} onChange={e => setForm(f => ({...f, location: e.target.value}))} placeholder="Frente de excavación, Pk..." required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Estado</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                {['abierta','en curso','cerrada'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="injured" checked={form.injured} onChange={e => setForm(f => ({...f, injured: e.target.checked}))}
                className="w-4 h-4 accent-red-600" />
              <label htmlFor="injured" className="text-sm text-slate-700 font-medium">¿Hubo lesionados?</label>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-600 mb-1">Descripción</label>
              <textarea rows={2} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} placeholder="Descripción de la incidencia..." required />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-600 mb-1">Acción correctiva</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.corrective_action} onChange={e => setForm(f => ({...f, corrective_action: e.target.value}))} placeholder="Medidas adoptadas o a adoptar..." />
            </div>
            <div className="md:col-span-3 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Guardando...' : 'Guardar incidencia'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[['todos','Todas'],['accidente','Accidentes'],['casi-accidente','Casi-accidentes'],['inspección','Inspecciones'],['abierta','Abiertas']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === val ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.map(inc => (
          <div key={inc.id} className={`card hover:shadow-md transition-shadow ${inc.severity === 'high' ? 'border-l-4 border-red-500' : inc.severity === 'medium' ? 'border-l-4 border-amber-400' : ''}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className={`badge capitalize ${TYPE_COLORS[inc.type] || 'bg-slate-100 text-slate-600'}`}>{inc.type}</span>
                  <span className={`badge ${SEV_COLORS[inc.severity] || 'bg-slate-100 text-slate-600'}`}>Gravedad {SEV_LABELS[inc.severity]}</span>
                  {inc.injured && <span className="badge bg-red-100 text-red-700">⚠️ Lesionado</span>}
                  <span className={`badge capitalize ${inc.status === 'cerrada' ? 'bg-green-100 text-green-700' : inc.status === 'en curso' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>{inc.status}</span>
                </div>
                <p className="text-sm font-medium text-slate-800 leading-snug">{inc.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs text-slate-400">📍 {inc.location}</span>
                  <span className="text-xs text-slate-400">📅 {inc.date}</span>
                </div>
                {inc.corrective_action && (
                  <p className="text-xs text-slate-500 mt-2 bg-slate-50 px-3 py-2 rounded-lg">
                    <span className="font-medium">Acción:</span> {inc.corrective_action}
                  </p>
                )}
              </div>
              <div className="flex gap-2 shrink-0">
                {inc.status === 'abierta' && (
                  <button onClick={() => handleClose(inc.id)} className="text-xs bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium transition-colors">
                    Cerrar
                  </button>
                )}
                <button onClick={() => handleDelete(inc.id)} className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2">✕</button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card text-center py-12 text-slate-400">
            <p className="text-4xl mb-2">🦺</p>
            <p className="font-medium">No hay incidencias en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
