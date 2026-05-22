import { useEffect, useState, useMemo } from 'react';
import { activitiesApi } from '../services/api';
import { GanttSkeleton } from '../components/PageLoader';

const STATUS_COLORS = {
  completed:   { bar: '#22c55e', label: 'Completada',  text: 'text-green-700', bg: 'bg-green-100' },
  in_progress: { bar: '#3b82f6', label: 'En curso',    text: 'text-blue-700',  bg: 'bg-blue-100'  },
  delayed:     { bar: '#ef4444', label: 'Retrasada',   text: 'text-red-700',   bg: 'bg-red-100'   },
  pending:     { bar: '#94a3b8', label: 'Pendiente',   text: 'text-slate-600', bg: 'bg-slate-100' },
};

const RANGE_START = '2026-04-01';
const RANGE_END   = '2026-05-31';
const DAY_W       = 28;
const ROW_H       = 40;
const LEFT_W      = 340;

function dateDiff(a, b) {
  return Math.floor((new Date(b) - new Date(a)) / 86400000);
}

function getDays(start, end) {
  const days = [];
  const cur  = new Date(start);
  while (cur <= new Date(end)) { days.push(new Date(cur)); cur.setDate(cur.getDate() + 1); }
  return days;
}

export default function GanttPage() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);

  // ALL hooks must run unconditionally — no early return before this block
  const today   = useMemo(() => new Date().toISOString().split('T')[0], []);
  const days    = useMemo(() => getDays(RANGE_START, RANGE_END), []);
  const totalW  = days.length * DAY_W;
  const todayX  = dateDiff(RANGE_START, today) * DAY_W;

  const months = useMemo(() => {
    const m = [];
    days.forEach((d, i) => {
      const label = d.toLocaleString('es', { month: 'long', year: 'numeric' });
      if (!m.length || m[m.length - 1].label !== label) m.push({ label, start: i, count: 1 });
      else m[m.length - 1].count++;
    });
    return m;
  }, [days]);

  const weekendStripes = useMemo(() =>
    days.map((d, i) => (d.getDay() === 0 || d.getDay() === 6) ? i : -1).filter(i => i >= 0),
  [days]);

  useEffect(() => {
    activitiesApi.getAll()
      .then(a => { setActivities(a); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Early return AFTER all hooks
  if (loading) return <GanttSkeleton />;

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Diagrama de Gantt</h1>
          <p className="text-slate-500 text-sm">Abril — Mayo 2026 · Túnel Yébenes</p>
        </div>
        <div className="flex gap-2 flex-wrap justify-end">
          {Object.entries(STATUS_COLORS).map(([k, v]) => (
            <span key={k} className={`badge ${v.bg} ${v.text}`}>{v.label}</span>
          ))}
        </div>
      </div>

      <div className="card flex-1 overflow-hidden flex flex-col p-0">
        <div className="flex overflow-hidden flex-1 min-h-0">

          {/* Left fixed panel */}
          <div className="shrink-0 border-r border-slate-200 overflow-y-auto" style={{ width: LEFT_W }}>
            <div className="border-b border-slate-200 bg-slate-50 flex items-end" style={{ height: 60 }}>
              <span className="flex-1 px-3 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actividad</span>
              <span className="w-16 pb-2 text-xs font-semibold text-slate-500 text-center">Dur.</span>
              <span className="w-20 pb-2 text-xs font-semibold text-slate-500 text-center">%</span>
            </div>
            {activities.map((act, i) => {
              const sc = STATUS_COLORS[act.status] || STATUS_COLORS.pending;
              return (
                <div key={act.id} className={`flex items-center border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}`} style={{ height: ROW_H }}>
                  <div className="flex-1 px-3 min-w-0">
                    <div className="flex items-center gap-1">
                      {act.is_critical === 1 && <span className="text-red-500 text-xs shrink-0">★</span>}
                      <span className="text-xs font-medium text-slate-700 truncate">{act.name}</span>
                    </div>
                  </div>
                  <div className="w-16 text-xs text-center text-slate-500 shrink-0">{act.duration}d</div>
                  <div className="w-20 px-2 shrink-0">
                    <div className="w-full bg-slate-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full" style={{ width: `${act.progress}%`, background: sc.bar }} />
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-0.5">{act.progress}%</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right scrollable panel */}
          <div className="flex-1 overflow-auto">
            <div style={{ width: totalW }}>
              <div className="flex sticky top-0 z-20 bg-slate-50 border-b border-slate-200" style={{ height: 30 }}>
                {months.map((m, i) => (
                  <div key={i} className="border-r border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600 capitalize shrink-0"
                    style={{ width: m.count * DAY_W }}>{m.label}</div>
                ))}
              </div>

              <div className="flex sticky top-[30px] z-20 bg-slate-50 border-b border-slate-200" style={{ height: 30 }}>
                {days.map((d, i) => {
                  const isWeekend = d.getDay() === 0 || d.getDay() === 6;
                  const isToday   = d.toISOString().split('T')[0] === today;
                  return (
                    <div key={i} className={`border-r border-slate-100 flex items-center justify-center text-xs shrink-0
                      ${isWeekend ? 'bg-slate-100 text-slate-400' : 'text-slate-500'}
                      ${isToday   ? '!bg-blue-100 font-bold text-blue-700' : ''}`}
                      style={{ width: DAY_W }}>
                      {d.getDate()}
                    </div>
                  );
                })}
              </div>

              <div className="relative" style={{ height: activities.length * ROW_H }}>
                {weekendStripes.map(i => (
                  <div key={i} className="absolute top-0 bottom-0 bg-slate-100/50 pointer-events-none"
                    style={{ left: i * DAY_W, width: DAY_W }} />
                ))}
                {todayX >= 0 && todayX <= totalW && (
                  <div className="absolute top-0 bottom-0 w-0.5 bg-blue-500 z-10 opacity-70 pointer-events-none"
                    style={{ left: todayX }} />
                )}
                {activities.map((act, i) => {
                  const sc       = STATUS_COLORS[act.status] || STATUS_COLORS.pending;
                  const startOff = dateDiff(RANGE_START, act.start_date);
                  const barW     = Math.max(DAY_W, (dateDiff(act.start_date, act.end_date) + 1) * DAY_W - 2);
                  return (
                    <div key={act.id}
                      className={`absolute left-0 right-0 border-b border-slate-100 ${i % 2 !== 0 ? 'bg-slate-50/30' : ''}`}
                      style={{ top: i * ROW_H, height: ROW_H, width: totalW }}>
                      <div className="absolute top-1/2 -translate-y-1/2 rounded flex items-center px-2 text-xs font-medium text-white z-10 overflow-hidden"
                        style={{ left: Math.max(0, startOff) * DAY_W, width: barW, height: 22, background: sc.bar }}
                        title={`${act.name} | ${act.start_date} → ${act.end_date}`}>
                        {barW > 40 && <span className="truncate">{act.progress}%</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
