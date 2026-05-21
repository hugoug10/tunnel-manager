import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { budgetApi } from '../services/budgetApi';

const IVA = 0.21;
const fmt  = n => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n || 0);
const fmtD = n => new Intl.NumberFormat('es-ES', { maximumFractionDigits: 2 }).format(n || 0);
const pct  = (a, b) => b > 0 ? (((a - b) / b) * 100).toFixed(1) : '0.0';

// ─── CALCULADORA ──────────────────────────────────────────────────────────────
function Calculadora({ catalog }) {
  const [matId, setMatId] = useState('');
  const [qty,   setQty]   = useState('');
  const [result, setResult] = useState(null);

  const mat = catalog.find(m => m.id === parseInt(matId));

  useEffect(() => {
    if (!mat || !qty || parseFloat(qty) <= 0) { setResult(null); return; }
    const base  = mat.price * parseFloat(qty);
    const iva   = base * IVA;
    setResult({ base, iva, total: base + iva });
  }, [matId, qty, mat]);

  return (
    <div className="space-y-6">
      <h2 className="font-bold text-slate-800 text-lg">Calculadora de Materiales</h2>
      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Material</label>
            <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={matId} onChange={e => setMatId(e.target.value)}>
              <option value="">— Selecciona material —</option>
              {catalog.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} · {fmtD(m.price)} €/{m.unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Cantidad {mat ? `(${mat.unit})` : ''}
            </label>
            <input type="number" min="0" step="0.01" placeholder="0.00"
              className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              value={qty} onChange={e => setQty(e.target.value)} />
          </div>
          <div className="flex items-end">
            {mat && (
              <div className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-500">
                Proveedor: <span className="font-medium text-slate-700">{mat.supplier}</span>
              </div>
            )}
          </div>
        </div>

        {result && (
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div className="bg-blue-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Base imponible</p>
              <p className="text-2xl font-bold text-blue-700">{fmt(result.base)}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">IVA 21%</p>
              <p className="text-2xl font-bold text-amber-600">{fmt(result.iva)}</p>
            </div>
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-500 mb-1">Total con IVA</p>
              <p className="text-2xl font-bold text-green-700">{fmt(result.total)}</p>
            </div>
          </div>
        )}
      </div>

      <div>
        <h3 className="font-semibold text-slate-700 mb-3">
          Catálogo completo — {catalog.length} materiales
        </h3>
        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                {['Material','Actividad asociada','Unidad','€/Ud','Proveedor','Categoría'].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {catalog.map((m, i) => (
                <tr key={m.id} className={`border-t border-slate-100 hover:bg-slate-50 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}`}>
                  <td className="px-4 py-2.5 font-medium text-slate-800">{m.name}</td>
                  <td className="px-4 py-2.5">
                    <span className="badge bg-blue-50 text-blue-700 text-xs capitalize">
                      {m.category}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{m.unit}</td>
                  <td className="px-4 py-2.5 font-semibold text-blue-700">{fmtD(m.price)} €</td>
                  <td className="px-4 py-2.5 text-slate-500">{m.supplier}</td>
                  <td className="px-4 py-2.5">
                    <span className="badge bg-slate-100 text-slate-600 capitalize">{m.category}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── SEMANAL ─────────────────────────────────────────────────────────────────
function PresupuestoSemanal({ summary }) {
  const weekly      = summary?.weekly      || [];
  const by_activity = summary?.by_activity || [];

  const overCostWeeks = weekly.filter(w => w.real > 0 && w.real > w.planned);
  const totalPlanned  = weekly.reduce((s, w) => s + w.planned, 0);
  const totalReal     = weekly.filter(w => w.real > 0).reduce((s, w) => s + w.real, 0);

  return (
    <div className="space-y-5">
      <h2 className="font-bold text-slate-800 text-lg">Presupuesto Semanal</h2>

      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <p className="text-xs text-slate-500 mb-1">Previsto acum.</p>
          <p className="text-xl font-bold text-slate-700">{fmt(totalPlanned)}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 mb-1">Ejecutado acum.</p>
          <p className="text-xl font-bold text-blue-700">{fmt(totalReal)}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 mb-1">Semanas sobrecoste</p>
          <p className={`text-xl font-bold ${overCostWeeks.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {overCostWeeks.length}
          </p>
        </div>
      </div>

      {overCostWeeks.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-lg">⚠️</span>
          <div>
            <p className="font-semibold text-red-700 text-sm">Alerta de sobrecoste</p>
            <p className="text-xs text-red-600 mt-0.5">
              {overCostWeeks.length} semana(s) superaron el presupuesto. Mayor desviación:{' '}
              {fmt(Math.max(...overCostWeeks.map(w => w.real - w.planned)))}
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-slate-700 mb-4">Coste semanal — Previsto vs Real</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={weekly} margin={{ left: 5, right: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="week" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k€`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => [fmt(v)]} />
            <Legend />
            <Bar dataKey="planned" name="Previsto" fill="#cbd5e1" radius={[3, 3, 0, 0]} />
            <Bar dataKey="real" name="Real" radius={[3, 3, 0, 0]}>
              {weekly.map((w, i) => (
                <Cell key={i} fill={w.real > w.planned ? '#ef4444' : w.real > 0 ? '#3b82f6' : '#e2e8f0'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {['Semana', 'Previsto', 'Real', 'Desviación', 'Estado'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {weekly.map((w, i) => {
              const dev = w.real > 0 ? w.real - w.planned : null;
              return (
                <tr key={i} className={`border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                  <td className="px-4 py-3 font-medium text-slate-800">{w.week}</td>
                  <td className="px-4 py-3 text-slate-600">{fmt(w.planned)}</td>
                  <td className="px-4 py-3 font-semibold">{w.real > 0 ? fmt(w.real) : <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3">
                    {dev !== null
                      ? <span className={`font-semibold ${dev > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {dev > 0 ? '+' : ''}{fmt(dev)} ({pct(w.real, w.planned)}%)
                        </span>
                      : <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {w.real === 0
                      ? <span className="badge bg-slate-100 text-slate-500">Pendiente</span>
                      : dev > 0
                        ? <span className="badge bg-red-100 text-red-700">Sobrecoste</span>
                        : <span className="badge bg-green-100 text-green-700">En presupuesto</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── MENSUAL ─────────────────────────────────────────────────────────────────
function PresupuestoMensual({ summary }) {
  const monthly       = summary?.monthly       || [];
  const total_planned = summary?.total_planned || 0;
  const total_real    = summary?.total_real    || 0;

  let accReal = 0, accPlan = 0;
  const accumulated = monthly.map(m => {
    accReal += m.real;
    accPlan += m.planned;
    return { ...m, accReal, accPlanned: accPlan };
  });

  const completion_pct = total_planned > 0 ? (total_real / total_planned) * 100 : 0;
  const forecast = completion_pct > 5
    ? total_planned / (completion_pct / 100)
    : total_planned;

  return (
    <div className="space-y-5">
      <h2 className="font-bold text-slate-800 text-lg">Presupuesto Mensual</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-xs text-slate-500 mb-1">Presupuesto total</p>
          <p className="text-xl font-bold text-slate-700">{fmt(total_planned)}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 mb-1">Ejecutado</p>
          <p className="text-xl font-bold text-blue-700">{fmt(total_real)}</p>
          <p className="text-xs text-slate-400 mt-0.5">{completion_pct.toFixed(1)}%</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 mb-1">Previsión fin de obra</p>
          <p className={`text-xl font-bold ${forecast > total_planned * 1.05 ? 'text-red-600' : 'text-green-600'}`}>
            {fmt(forecast)}
          </p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 mb-1">Pendiente</p>
          <p className="text-xl font-bold text-amber-600">{fmt(total_planned - total_real)}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-slate-700 mb-4">Evolución económica acumulada</h3>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={accumulated} margin={{ left: 5, right: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tickFormatter={v => `${(v / 1000).toFixed(0)}k€`} tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => [fmt(v)]} />
            <Legend />
            <Line type="monotone" dataKey="accPlanned" name="Previsto acumulado" stroke="#94a3b8" strokeDasharray="5 5" dot={false} strokeWidth={2} />
            <Line type="monotone" dataKey="accReal"    name="Real acumulado"     stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: '#3b82f6' }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              {['Mes', 'Previsto', 'Real', 'Acum. real', 'Desv. acum.'].map(h => (
                <th key={h} className="px-4 py-3 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {accumulated.map((m, i) => {
              const dev = m.accReal - m.accPlanned;
              return (
                <tr key={i} className={`border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                  <td className="px-4 py-3 font-medium text-slate-800">{m.month}</td>
                  <td className="px-4 py-3 text-slate-600">{m.planned > 0 ? fmt(m.planned) : '—'}</td>
                  <td className="px-4 py-3 font-semibold">{m.real > 0 ? fmt(m.real) : <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3">{m.accReal > 0 ? fmt(m.accReal) : <span className="text-slate-300">—</span>}</td>
                  <td className="px-4 py-3">
                    {m.accReal > 0 && (
                      <span className={`font-semibold ${dev > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {dev > 0 ? '+' : ''}{fmt(dev)}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── RESUMEN + IA ─────────────────────────────────────────────────────────────
function ResumenEconomico({ summary, items, aiAnalysis }) {
  const total_planned    = summary?.total_planned    || 0;
  const total_real       = summary?.total_real       || 0;
  const deviation        = summary?.deviation        || 0;
  const deviation_pct    = summary?.deviation_pct    || 0;
  const financial_progress = summary?.financial_progress || 0;
  const by_activity      = summary?.by_activity      || [];

  function exportPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16); doc.setTextColor(30, 64, 175);
    doc.text('RESUMEN ECONÓMICO — SOTERRAMIENTO A5', 14, 18);
    doc.setFontSize(10); doc.setTextColor(100);
    doc.text(`Generado: ${new Date().toLocaleDateString('es-ES')}`, 14, 26);

    autoTable(doc, {
      startY: 32,
      head: [['Concepto', 'Importe']],
      body: [
        ['Presupuesto total', fmt(total_planned)],
        ['Coste ejecutado', fmt(total_real)],
        ['Desviación', `${deviation >= 0 ? '+' : ''}${fmt(deviation)} (${Number(deviation_pct).toFixed(1)}%)`],
        ['Pendiente de ejecutar', fmt(total_planned - total_real)],
        ['Progreso financiero', `${financial_progress}%`],
      ],
      headStyles: { fillColor: [30, 64, 175] },
    });

    if (by_activity.length > 0) {
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Actividad', 'Planificado', 'Real', 'Desviación']],
        body: by_activity.map(a => [
          a.name.substring(0, 45),
          fmt(a.planned), fmt(a.real),
          `${a.deviation >= 0 ? '+' : ''}${fmt(a.deviation)}`
        ]),
        headStyles: { fillColor: [71, 85, 105] },
        styles: { fontSize: 8 },
      });
    }

    doc.save('resumen-economico-soterramiento-a5.pdf');
  }

  function exportExcel() {
    import('xlsx').then(XLSX => {
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet([
          { Concepto: 'Presupuesto total',  Importe: total_planned },
          { Concepto: 'Coste ejecutado',    Importe: total_real    },
          { Concepto: 'Desviación',         Importe: deviation     },
          { Concepto: 'Pendiente',          Importe: total_planned - total_real },
        ]), 'KPIs');
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet(by_activity.map(a => ({
          Actividad: a.name, Planificado: a.planned, Real: a.real, Desviación: a.deviation
        }))), 'Por actividad');
      XLSX.utils.book_append_sheet(wb,
        XLSX.utils.json_to_sheet(items.map(i => ({
          Descripción: i.description, Actividad: i.activity_name,
          Unidad: i.unit, 'Qty plan.': i.qty_planned, 'Qty real': i.qty_real,
          '€/Ud': i.unit_price, 'Coste plan.': i.cost_planned, 'Coste real': i.cost_real,
          'Desv.%': i.deviation_pct
        }))), 'Partidas');
      XLSX.writeFile(wb, 'presupuesto-soterramiento-a5.xlsx');
    });
  }

  const SEVERITY = {
    high:   { border: 'border-red-300    bg-red-50',    text: 'text-red-700'    },
    medium: { border: 'border-amber-300  bg-amber-50',  text: 'text-amber-700'  },
    low:    { border: 'border-blue-200   bg-blue-50',   text: 'text-blue-700'   },
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-slate-800 text-lg">Resumen Económico</h2>
        <div className="flex gap-2">
          <button onClick={exportPDF}   className="btn-secondary text-xs flex items-center gap-1.5">📥 PDF</button>
          <button onClick={exportExcel} className="btn-secondary text-xs flex items-center gap-1.5">📊 Excel</button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-xs text-slate-500 mb-1">Presupuesto total</p>
          <p className="text-2xl font-bold text-slate-800">{fmt(total_planned)}</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 mb-1">Coste ejecutado</p>
          <p className="text-2xl font-bold text-blue-700">{fmt(total_real)}</p>
          <p className="text-xs text-slate-400 mt-0.5">{financial_progress}% del total</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 mb-1">Desviación total</p>
          <p className={`text-2xl font-bold ${deviation > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {deviation > 0 ? '+' : ''}{fmt(deviation)}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">{Number(deviation_pct).toFixed(1)}%</p>
        </div>
        <div className="card text-center">
          <p className="text-xs text-slate-500 mb-1">Pendiente</p>
          <p className="text-2xl font-bold text-amber-600">{fmt(total_planned - total_real)}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="card">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-700">Progreso financiero global</span>
          <span className="text-sm font-bold text-blue-700">{financial_progress}%</span>
        </div>
        <div className="w-full bg-slate-100 rounded-full h-3">
          <div className="h-3 rounded-full bg-blue-600 transition-all duration-500"
            style={{ width: `${Math.min(100, financial_progress)}%` }} />
        </div>
      </div>

      {/* Coste por actividad */}
      {by_activity.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-slate-700 mb-4">Coste por actividad</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={by_activity} layout="vertical" margin={{ left: 10, right: 60 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tickFormatter={v => `${(v / 1000).toFixed(0)}k€`} tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" width={190}
                tick={{ fontSize: 9 }}
                tickFormatter={v => v.split(' ').slice(0, 3).join(' ')} />
              <Tooltip formatter={v => [fmt(v)]} />
              <Legend />
              <Bar dataKey="planned" name="Planificado" fill="#cbd5e1" radius={[0, 3, 3, 0]} />
              <Bar dataKey="real"    name="Real"        fill="#3b82f6" radius={[0, 3, 3, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* IA Análisis */}
      {aiAnalysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="card border-l-4 border-blue-500">
            <h3 className="font-semibold text-blue-700 mb-3">🤖 Análisis IA — Alertas económicas</h3>
            <div className="space-y-2">
              {(aiAnalysis.alerts || []).map((a, i) => {
                const s = SEVERITY[a.severity] || SEVERITY.low;
                return (
                  <div key={i} className={`border rounded-lg p-3 ${s.border}`}>
                    <p className={`text-xs font-semibold ${s.text}`}>{a.message}</p>
                    <p className="text-xs text-slate-500 mt-1">→ {a.recommendation}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="card border-l-4 border-green-500">
            <h3 className="font-semibold text-green-700 mb-3">💡 Recomendaciones IA</h3>
            <ul className="space-y-2">
              {(aiAnalysis.recommendations || []).map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                  <span className="text-green-500 font-bold shrink-0 mt-0.5">{i + 1}.</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Tabla partidas */}
      {items.length > 0 && (
        <div>
          <h3 className="font-semibold text-slate-700 mb-3">Partidas presupuestarias ({items.length})</h3>
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  {['Descripción','Actividad','Ud','Qty Plan.','Qty Real','€/Ud','Coste Plan.','Coste Real','Desv.%'].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.id} className={`border-t border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}>
                    <td className="px-3 py-2.5 font-medium text-slate-800 max-w-[200px] truncate">{item.description}</td>
                    <td className="px-3 py-2.5 text-slate-500 text-xs max-w-[150px] truncate">{item.activity_name}</td>
                    <td className="px-3 py-2.5 text-slate-500">{item.unit}</td>
                    <td className="px-3 py-2.5 text-slate-600">{fmtD(item.qty_planned)}</td>
                    <td className="px-3 py-2.5">{item.qty_real > 0 ? fmtD(item.qty_real) : <span className="text-slate-300">—</span>}</td>
                    <td className="px-3 py-2.5 text-slate-600">{fmtD(item.unit_price)} €</td>
                    <td className="px-3 py-2.5 text-slate-600">{fmt(item.cost_planned)}</td>
                    <td className="px-3 py-2.5 font-semibold">{item.qty_real > 0 ? fmt(item.cost_real) : <span className="text-slate-300">—</span>}</td>
                    <td className="px-3 py-2.5">
                      {item.qty_real > 0 && (
                        <span className={`font-bold ${item.deviation_pct > 5 ? 'text-red-600' : item.deviation_pct < 0 ? 'text-green-600' : 'text-slate-600'}`}>
                          {item.deviation_pct > 0 ? '+' : ''}{item.deviation_pct}%
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── PÁGINA PRINCIPAL ─────────────────────────────────────────────────────────
const TABS = [
  { id: 'calc',    label: '🧮 Calculadora'  },
  { id: 'weekly',  label: '📅 Semanal'      },
  { id: 'monthly', label: '📆 Mensual'      },
  { id: 'summary', label: '📊 Resumen + IA' },
];

export default function BudgetPage() {
  const [tab,        setTab]        = useState('calc');
  const [catalog,    setCatalog]    = useState([]);
  const [items,      setItems]      = useState([]);
  const [summary,    setSummary]    = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(null);

  useEffect(() => {
    Promise.all([
      budgetApi.getCatalog(),
      budgetApi.getItems(),
      budgetApi.getSummary(),
      budgetApi.getAiAnalysis(),
    ])
      .then(([c, it, s, ai]) => {
        setCatalog(c || []);
        setItems(it || []);
        setSummary(s || {});
        setAiAnalysis(ai || { alerts: [], recommendations: [] });
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <svg className="w-10 h-10 animate-spin text-blue-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
        </svg>
        <p className="text-sm text-slate-500">Cargando módulo económico...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex items-center justify-center h-full">
      <div className="card border-red-200 text-center max-w-sm">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="font-semibold text-red-700">Error al cargar datos</p>
        <p className="text-xs text-slate-500 mt-1">{error}</p>
        <p className="text-xs text-slate-400 mt-2">Verifica que el backend está corriendo en localhost:3001</p>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-5 overflow-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Presupuestos</h1>
        <p className="text-slate-500 text-sm">
          Control económico · {catalog.length} materiales · {items.length} partidas
        </p>
      </div>

      <div className="flex gap-1 border-b border-slate-200">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              tab === t.id
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'calc'    && <Calculadora         catalog={catalog} />}
      {tab === 'weekly'  && <PresupuestoSemanal   summary={summary} />}
      {tab === 'monthly' && <PresupuestoMensual   summary={summary} />}
      {tab === 'summary' && <ResumenEconomico     summary={summary} items={items} aiAnalysis={aiAnalysis} />}
    </div>
  );
}
