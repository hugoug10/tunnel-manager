import { useEffect, useState } from 'react';
import { activitiesApi } from '../services/api';
import { TableSkeleton } from '../components/PageLoader';

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pendiente', color: 'bg-slate-100 text-slate-600' },
  { value: 'in_progress', label: 'En curso', color: 'bg-blue-100 text-blue-700' },
  { value: 'completed', label: 'Completada', color: 'bg-green-100 text-green-700' },
  { value: 'delayed', label: 'Retrasada', color: 'bg-red-100 text-red-700' },
];

function StatusBadge({ status }) {
  const opt = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[0];
  return <span className={`badge ${opt.color}`}>{opt.label}</span>;
}

function ActivityModal({ activity, onClose, onSave }) {
  const [form, setForm] = useState({
    status: activity.status || 'pending',
    progress: activity.progress || 0,
    real_start: activity.real_start || '',
    real_end: activity.real_end || '',
    real_days: activity.real_days || 0,
    observations: activity.observations || '',
    daily_yield: activity.daily_yield || 0,
  });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function handleSave() {
    await activitiesApi.update(activity.id, { ...activity, ...form });
    onSave();
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
        <div className="px-6 py-4 border-b border-slate-200 flex items-start justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-base">{activity.name}</h2>
            <p className="text-xs text-slate-500 mt-0.5">Plan: {activity.start_date} → {activity.end_date} ({activity.duration} días)</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-lg leading-none">✕</button>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Estado</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Progreso (%)</label>
              <input type="number" min="0" max="100"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.progress} onChange={e => set('progress', +e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Inicio real</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.real_start} onChange={e => set('real_start', e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Fin real</label>
              <input type="date" className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.real_end} onChange={e => set('real_end', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Días reales ejecutados</label>
              <input type="number" min="0"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.real_days} onChange={e => set('real_days', +e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Rendimiento diario</label>
              <input type="number" step="0.1" min="0"
                className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.daily_yield} onChange={e => set('daily_yield', +e.target.value)} />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Observaciones</label>
            <textarea rows={3}
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              value={form.observations} onChange={e => set('observations', e.target.value)}
              placeholder="Notas, incidencias, comentarios..." />
          </div>
        </div>
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary">Cancelar</button>
          <button onClick={handleSave} className="btn-primary">Guardar cambios</button>
        </div>
      </div>
    </div>
  );
}

export default function ActivityPage() {
  const [activities, setActivities] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('all');

  const [loading, setLoading] = useState(true);
  const load = () => activitiesApi.getAll().then(a => { setActivities(a); setLoading(false); }).catch(console.error);
  useEffect(() => { load(); }, []);
  if (loading) return <TableSkeleton rows={6} />;

  const filtered = filter === 'all' ? activities : activities.filter(a => a.status === filter);

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestión de Actividades</h1>
          <p className="text-slate-500 text-sm">Actualiza el estado y producción real de cada tarea</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'in_progress', 'delayed', 'pending', 'completed'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === f ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
              {f === 'all' ? 'Todas' : STATUS_OPTIONS.find(o => o.value === f)?.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {filtered.map(act => {
          const deviation = act.real_days > 0 ? act.real_days - act.duration : 0;
          return (
            <div key={act.id} className="card hover:shadow-md transition-shadow cursor-pointer" onClick={() => setSelected(act)}>
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {act.is_critical === 1 && <span className="text-red-500 text-xs font-bold">★ CRÍTICA</span>}
                    <StatusBadge status={act.status} />
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm truncate">{act.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{act.start_date} → {act.end_date} · {act.duration} días planificados</p>
                </div>

                <div className="shrink-0 text-center w-20">
                  <div className="text-2xl font-bold text-blue-700">{act.progress}%</div>
                  <div className="text-xs text-slate-500">Progreso</div>
                </div>

                {act.real_days > 0 && (
                  <div className={`shrink-0 text-center w-20 ${deviation > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    <div className="text-2xl font-bold">{deviation > 0 ? `+${deviation}` : deviation}</div>
                    <div className="text-xs">días desv.</div>
                  </div>
                )}

                <div className="shrink-0">
                  <button className="btn-secondary text-xs" onClick={e => { e.stopPropagation(); setSelected(act); }}>
                    Editar
                  </button>
                </div>
              </div>

              <div className="mt-3">
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="h-2 rounded-full transition-all"
                    style={{ width: `${act.progress}%`, background: act.status === 'delayed' ? '#ef4444' : act.status === 'completed' ? '#22c55e' : '#3b82f6' }} />
                </div>
              </div>

              {act.observations && (
                <p className="text-xs text-slate-500 mt-2 italic">"{act.observations}"</p>
              )}
            </div>
          );
        })}
      </div>

      {selected && (
        <ActivityModal activity={selected} onClose={() => setSelected(null)} onSave={load} />
      )}
    </div>
  );
}
