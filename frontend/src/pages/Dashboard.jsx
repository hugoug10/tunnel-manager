import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { activitiesApi } from '../services/api';
import { DashboardSkeleton } from '../components/PageLoader';

const STATUS_COLORS = { completed: '#22c55e', in_progress: '#3b82f6', delayed: '#ef4444', pending: '#94a3b8' };

function StatCard({ label, value, sub, color }) {
  const cls = { blue: 'bg-blue-50 text-blue-700', green: 'bg-green-50 text-green-700', red: 'bg-red-50 text-red-700', gray: 'bg-slate-50 text-slate-600' };
  return (
    <div className="card flex items-center gap-4">
      <div className={`rounded-xl px-4 py-3 ${cls[color]}`}>
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <div>
        <p className="font-semibold text-slate-800">{label}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    Promise.all([
      activitiesApi.getSummary(),
      activitiesApi.getAll(),
    ]).then(([s, a]) => { setStats(s); setActivities(a); })
      .catch(() => {
        setStats({ total: 0, completed: 0, in_progress: 0, delayed: 0, pending: 0, avg_progress: 0, delayed_list: [], upcoming: [] });
        setActivities([]);
      });
  }, []);

  if (!stats) return <DashboardSkeleton />;

  const pieData = [
    { name: 'Completadas', value: stats.completed,   color: STATUS_COLORS.completed  },
    { name: 'En curso',    value: stats.in_progress, color: STATUS_COLORS.in_progress },
    { name: 'Retrasadas',  value: stats.delayed,     color: STATUS_COLORS.delayed     },
    { name: 'Pendientes',  value: stats.pending,     color: STATUS_COLORS.pending     },
  ].filter(d => d.value > 0);

  const barData = activities.slice(0, 8).map(a => ({
    name: a.name.split(' ').slice(0, 3).join(' '),
    Real: a.progress || 0,
  }));

  return (
    <div className="p-4 md:p-6 space-y-5 overflow-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard — Túnel Yébenes</h1>
        <p className="text-slate-500 text-sm mt-1">Resumen en tiempo real</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress ring */}
        <div className="card flex flex-col items-center justify-center py-5">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="12" />
              <circle cx="50" cy="50" r="38" fill="none" stroke="#3b82f6" strokeWidth="12"
                strokeDasharray={`${2 * Math.PI * 38 * stats.avg_progress / 100} ${2 * Math.PI * 38}`}
                strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-blue-700">
              {stats.avg_progress}%
            </span>
          </div>
          <p className="mt-2 font-semibold text-slate-600 text-sm">Avance Total</p>
        </div>
        <StatCard label="Completadas"  value={stats.completed}   sub={`de ${stats.total} actividades`} color="green" />
        <StatCard label="Retrasadas"   value={stats.delayed}     sub="requieren atención"              color="red"   />
        <StatCard label="En Curso"     value={stats.in_progress} sub="actividades activas"             color="blue"  />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-3">Estado actividades</h2>
          <ResponsiveContainer width="100%" height={170}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value">
                {pieData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map(e => (
              <span key={e.name} className="flex items-center gap-1 text-xs text-slate-600">
                <span className="w-2 h-2 rounded-full inline-block" style={{ background: e.color }} />
                {e.name} ({e.value})
              </span>
            ))}
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-slate-700 mb-3">Progreso por actividad (%)</h2>
          <ResponsiveContainer width="100%" height={170}>
            <BarChart data={barData} margin={{ left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} angle={-20} textAnchor="end" interval={0} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="Real" fill="#3b82f6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alerts + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {stats.delayed_list?.length > 0 && (
          <div className="card border-l-4 border-red-400">
            <h2 className="font-semibold text-red-700 mb-3">⚠️ Alertas de retraso ({stats.delayed_list.length})</h2>
            <ul className="space-y-2">
              {stats.delayed_list.map(a => (
                <li key={a.id} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-red-400 mt-0.5 shrink-0">●</span>
                  <div>
                    <p className="font-medium leading-tight">{a.name}</p>
                    <p className="text-xs text-slate-400">Fin previsto: {a.end_date} · {a.progress}%</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-3">📅 Próximas actividades</h2>
          {!stats.upcoming?.length
            ? <p className="text-sm text-slate-400">No hay actividades próximas pendientes</p>
            : <ul className="space-y-2">
                {stats.upcoming.map(a => (
                  <li key={a.id} className="text-sm text-slate-700 flex gap-2">
                    <span className="text-blue-400 mt-0.5 shrink-0">●</span>
                    <div>
                      <p className="font-medium leading-tight">{a.name}</p>
                      <p className="text-xs text-slate-400">Inicio: {a.start_date} · {a.duration} días</p>
                    </div>
                  </li>
                ))}
              </ul>
          }
        </div>
      </div>
    </div>
  );
}
