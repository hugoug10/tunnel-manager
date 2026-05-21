import { useState, useEffect } from 'react';
import axios from 'axios';

const STATUS_COLORS = { operativa: 'bg-green-100 text-green-700', avería: 'bg-red-100 text-red-700', mantenimiento: 'bg-amber-100 text-amber-700' };
const MACHINES = ['Tuneladora TBM-1','Excavadora CAT 390','Volquete Scania R450','Bomba de hormigón Schwing','Grúa Liebherr LTM1100','Compresor Atlas Copco'];
const EMPTY_FORM = { date: new Date().toISOString().split('T')[0], machine: 'Excavadora CAT 390', operator: '', hours: '', fuel_liters: '', status: 'operativa', notes: '' };

export default function MaquinariaPage() {
  const [logs, setLogs]       = useState([]);
  const [stats, setStats]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]       = useState(EMPTY_FORM);
  const [saving, setSaving]   = useState(false);
  const [activeMachine, setActiveMachine] = useState('todas');

  const load = async () => {
    const [l, s] = await Promise.all([axios.get('/api/maquinaria'), axios.get('/api/maquinaria/stats')]);
    setLogs(l.data);
    setStats(s.data);
  };
  useEffect(() => { load(); }, []);

  const machines = ['todas', ...new Set(logs.map(l => l.machine))];
  const filtered = activeMachine === 'todas' ? logs : logs.filter(l => l.machine === activeMachine);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.post('/api/maquinaria', { ...form, hours: parseFloat(form.hours), fuel_liters: parseFloat(form.fuel_liters) });
      await load();
      setShowForm(false);
      setForm(EMPTY_FORM);
    } finally { setSaving(false); }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar registro?')) return;
    await axios.delete(`/api/maquinaria/${id}`);
    load();
  }

  return (
    <div className="p-6 space-y-5 overflow-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Maquinaria</h1>
          <p className="text-slate-500 text-sm">{logs.length} registros · Control de parque de maquinaria</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary">+ Registrar jornada</button>
      </div>

      {/* KPIs */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-3xl font-bold text-slate-800">{stats.total_hours.toFixed(0)}</p>
            <p className="text-xs text-slate-500 mt-1">Horas totales</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.total_fuel.toFixed(0)}</p>
            <p className="text-xs text-slate-500 mt-1">Litros combustible</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-red-600">{stats.breakdowns}</p>
            <p className="text-xs text-slate-500 mt-1">Averías registradas</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-slate-800">{stats.by_machine?.length || 0}</p>
            <p className="text-xs text-slate-500 mt-1">Equipos activos</p>
          </div>
        </div>
      )}

      {/* Machine breakdown cards */}
      {stats?.by_machine?.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats.by_machine.map(m => {
            const breakdownRate = m.days > 0 ? Math.round((m.breakdowns / m.days) * 100) : 0;
            const hasAlert = stats.alerts?.some(a => a.machine === m.machine);
            return (
              <div key={m.machine} className={`card ${hasAlert ? 'border-red-200 border' : ''}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-slate-800 text-sm">{m.machine}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{m.days} jornadas registradas</p>
                  </div>
                  {hasAlert && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">⚠️ Alerta</span>}
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-slate-700">{m.hours.toFixed(0)}</p>
                    <p className="text-xs text-slate-400">horas</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-700">{m.fuel.toFixed(0)}</p>
                    <p className="text-xs text-slate-400">litros</p>
                  </div>
                  <div>
                    <p className={`text-lg font-bold ${breakdownRate > 20 ? 'text-red-600' : 'text-slate-700'}`}>{breakdownRate}%</p>
                    <p className="text-xs text-slate-400">averías</p>
                  </div>
                </div>
                {hasAlert && (
                  <p className="mt-3 text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">
                    Tasa de averías alta ({breakdownRate}%). Revisar mantenimiento preventivo.
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="card border-blue-200 border">
          <h3 className="font-semibold text-slate-700 mb-4">Registrar jornada de maquinaria</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Fecha</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.date} onChange={e => setForm(f => ({...f, date: e.target.value}))} required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Máquina</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.machine} onChange={e => setForm(f => ({...f, machine: e.target.value}))}>
                {MACHINES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Operador</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.operator} onChange={e => setForm(f => ({...f, operator: e.target.value}))} placeholder="Nombre del operador" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Horas trabajadas</label>
              <input type="number" step="0.5" min="0" max="24" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.hours} onChange={e => setForm(f => ({...f, hours: e.target.value}))} placeholder="8.0" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Combustible (L)</label>
              <input type="number" step="1" min="0" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.fuel_liters} onChange={e => setForm(f => ({...f, fuel_liters: e.target.value}))} placeholder="120" required />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Estado</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.status} onChange={e => setForm(f => ({...f, status: e.target.value}))}>
                {['operativa','mantenimiento','avería'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-medium text-slate-600 mb-1">Notas</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Incidencias, trabajos realizados..." />
            </div>
            <div className="md:col-span-3 flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">{saving ? 'Guardando...' : 'Guardar'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Filter by machine */}
      <div className="flex gap-2 flex-wrap">
        {machines.map(m => (
          <button key={m} onClick={() => setActiveMachine(m)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeMachine === m ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {m === 'todas' ? 'Todas' : m.split(' ').slice(0, 2).join(' ')}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Fecha','Máquina','Operador','Horas','Comb. (L)','Estado','Notas',''].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(l => (
              <tr key={l.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-4 py-3 text-slate-600">{l.date}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{l.machine}</td>
                <td className="px-4 py-3 text-slate-600">{l.operator}</td>
                <td className="px-4 py-3 text-slate-800">{l.hours}h</td>
                <td className="px-4 py-3 text-slate-600">{l.fuel_liters} L</td>
                <td className="px-4 py-3">
                  <span className={`badge capitalize ${STATUS_COLORS[l.status] || 'bg-slate-100 text-slate-600'}`}>{l.status}</span>
                </td>
                <td className="px-4 py-3 text-slate-400 text-xs max-w-xs truncate">{l.notes}</td>
                <td className="px-4 py-3">
                  <button onClick={() => handleDelete(l.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all text-xs">✕</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-12 text-center text-slate-400">No hay registros para este equipo</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
