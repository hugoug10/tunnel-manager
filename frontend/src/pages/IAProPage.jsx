import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const RISK_COLORS = { none: 'bg-green-100 text-green-700', low: 'bg-green-100 text-green-700', medium: 'bg-amber-100 text-amber-700', high: 'bg-red-100 text-red-700' };
const RISK_LABELS = { none: 'Sin riesgo', low: 'Bajo', medium: 'Medio', high: 'Alto' };
const PRIORITY_COLORS = { high: 'bg-red-100 text-red-700 border-red-200', medium: 'bg-amber-100 text-amber-700 border-amber-200', low: 'bg-slate-100 text-slate-600 border-slate-200' };
const PRIORITY_ICONS  = { high: '🔴', medium: '🟡', low: '🟢' };

function PrediccionTab() {
  const [data, setData] = useState(null);
  useEffect(() => { axios.get('/api/ia/prediccion').then(r => setData(r.data)); }, []);

  if (!data) return <div className="text-center py-12 text-slate-400">Calculando predicciones...</div>;

  const { predictions, summary } = data;
  return (
    <div className="space-y-5">
      {/* Summary banner */}
      <div className={`rounded-xl p-5 ${summary.global_delay > 10 ? 'bg-red-50 border border-red-200' : summary.global_delay > 0 ? 'bg-amber-50 border border-amber-200' : 'bg-green-50 border border-green-200'}`}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Fin planificado</p>
            <p className="text-lg font-bold text-slate-800">{summary.planned_global_end}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Fin previsto IA</p>
            <p className={`text-lg font-bold ${summary.global_delay > 0 ? 'text-red-700' : 'text-green-700'}`}>{summary.predicted_global_end}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Desviación global</p>
            <p className={`text-lg font-bold ${summary.global_delay > 0 ? 'text-red-700' : 'text-green-700'}`}>
              {summary.global_delay > 0 ? `+${summary.global_delay} días` : 'En plazo'}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Actividades riesgo alto</p>
            <p className={`text-lg font-bold ${summary.high_risk_count > 0 ? 'text-red-700' : 'text-green-700'}`}>{summary.high_risk_count}</p>
          </div>
        </div>
      </div>

      {/* Predictions table */}
      <div className="card overflow-hidden p-0">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {['Actividad','Estado','Progreso','Fin planificado','Fin previsto IA','Desviación','Riesgo'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-slate-600">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {predictions.map(p => (
              <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-800 text-sm">{p.name}</div>
                  {p.is_critical === 1 && <span className="text-xs text-red-600 font-medium">★ Crítica</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`badge capitalize ${p.status === 'completed' ? 'bg-green-100 text-green-700' : p.status === 'in_progress' ? 'bg-blue-100 text-blue-700' : p.status === 'delayed' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                    {p.status === 'completed' ? 'Completada' : p.status === 'in_progress' ? 'En curso' : p.status === 'delayed' ? 'Retrasada' : 'Pendiente'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-slate-200 rounded-full h-1.5">
                      <div className="h-1.5 rounded-full bg-blue-500" style={{ width: `${p.progress || 0}%` }} />
                    </div>
                    <span className="text-xs text-slate-600">{p.progress || 0}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{p.planned_end}</td>
                <td className="px-4 py-3 font-medium text-slate-800">{p.predicted_end}</td>
                <td className="px-4 py-3">
                  {p.delay_days > 0
                    ? <span className="text-red-600 font-semibold">+{p.delay_days} días</span>
                    : <span className="text-green-600">En plazo</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`badge ${RISK_COLORS[p.risk]}`}>{RISK_LABELS[p.risk]}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OptimizadorTab() {
  const [data, setData] = useState(null);
  useEffect(() => { axios.get('/api/ia/optimizador').then(r => setData(r.data)); }, []);

  if (!data) return <div className="text-center py-12 text-slate-400">Analizando recursos...</div>;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center border-l-4 border-red-500">
          <p className="text-3xl font-bold text-red-600">{data.delayed_count}</p>
          <p className="text-xs text-slate-500 mt-1">Actividades con retraso</p>
        </div>
        <div className="card text-center border-l-4 border-amber-500">
          <p className="text-3xl font-bold text-amber-600">{data.critical_pending}</p>
          <p className="text-xs text-slate-500 mt-1">Críticas pendientes</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-slate-700">Recomendaciones de optimización</h3>
        {data.suggestions.map((s, i) => (
          <div key={i} className={`card border ${PRIORITY_COLORS[s.priority]}`}>
            <div className="flex items-start gap-3">
              <span className="text-lg shrink-0">{PRIORITY_ICONS[s.priority]}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <div>
                    <p className="text-xs font-medium text-slate-500">{s.activity}</p>
                    <p className="font-semibold text-slate-800 text-sm">{s.action}</p>
                  </div>
                  <span className="text-xs font-semibold bg-white border px-2 py-1 rounded-lg shrink-0 text-green-700">
                    {s.saving}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{s.detail}</p>
              </div>
            </div>
          </div>
        ))}
        {data.suggestions.length === 0 && (
          <div className="card text-center py-8 text-slate-400">
            <p className="text-3xl mb-2">✅</p>
            <p>Obra dentro de parámetros. Sin acciones urgentes.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatTab() {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hola! Soy el asistente de obra. Puedo responder preguntas sobre el avance, retrasos, materiales, seguridad, maquinaria, calidad y costes. ¿En qué puedo ayudarte?' }
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const QUICK = ['¿Cuál es el avance global?','¿Hay actividades retrasadas?','¿Cómo va el presupuesto?','¿Cuántas horas de maquinaria?','Estado de seguridad'];

  async function send(text) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    setMessages(m => [...m, { role: 'user', text: msg }]);
    setLoading(true);
    try {
      const r = await axios.post('/api/ia/chat', { message: msg });
      setMessages(m => [...m, { role: 'assistant', text: r.data.answer }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="flex flex-col h-[600px]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pr-1 mb-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {m.role === 'assistant' && <span className="text-lg mr-2 mt-1 shrink-0">🤖</span>}
            <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              m.role === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm'
            }`}>
              {m.text.split('\n').map((line, j) => (
                <span key={j}>
                  {line.replace(/\*\*(.*?)\*\*/g, (_, t) => t).split(/(\*\*.*?\*\*)/).map((part, k) =>
                    part.startsWith('**') ? <strong key={k}>{part.slice(2, -2)}</strong> : part
                  )}
                  {j < m.text.split('\n').length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <span className="text-lg mr-2 mt-1">🤖</span>
            <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-bl-sm">
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      <div className="flex gap-2 flex-wrap mb-3">
        {QUICK.map(q => (
          <button key={q} onClick={() => send(q)} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full transition-colors">
            {q}
          </button>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={e => { e.preventDefault(); send(); }} className="flex gap-2">
        <input className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={input} onChange={e => setInput(e.target.value)} placeholder="Pregunta sobre la obra..." disabled={loading} />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary px-5">Enviar</button>
      </form>
    </div>
  );
}

const TABS = [
  { id: 'prediccion', label: 'Predicción de retrasos', icon: '📈' },
  { id: 'optimizador', label: 'Optimizador de recursos', icon: '⚙️' },
  { id: 'chat', label: 'Chat con la obra', icon: '💬' },
];

export default function IAProPage() {
  const [activeTab, setActiveTab] = useState('prediccion');

  return (
    <div className="p-6 space-y-5 overflow-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">IA Avanzada</h1>
        <p className="text-slate-500 text-sm">Predicción, optimización y consulta inteligente de la obra</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === t.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
            }`}>
            <span>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === 'prediccion'  && <PrediccionTab />}
        {activeTab === 'optimizador' && <OptimizadorTab />}
        {activeTab === 'chat'        && <ChatTab />}
      </div>
    </div>
  );
}
