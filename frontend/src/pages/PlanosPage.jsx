import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const CATEGORIES = ['Todas', 'topografía', 'estructura', 'drenaje', 'instalaciones', 'seguridad', 'calidad', 'general'];
const TYPE_ICONS = { plano: '📐', documento: '📄', informe: '📊', foto: '📷' };
const CAT_COLORS = { topografía: 'bg-blue-100 text-blue-700', estructura: 'bg-purple-100 text-purple-700', drenaje: 'bg-cyan-100 text-cyan-700', instalaciones: 'bg-amber-100 text-amber-700', seguridad: 'bg-red-100 text-red-700', calidad: 'bg-green-100 text-green-700', general: 'bg-slate-100 text-slate-600' };

export default function PlanosPage() {
  const [docs, setDocs]         = useState([]);
  const [filter, setFilter]     = useState('Todas');
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const fileRef = useRef();
  const [form, setForm] = useState({ name: '', type: 'plano', category: 'estructura' });

  const load = () => axios.get('/api/planos').then(r => setDocs(r.data));
  useEffect(() => { load(); }, []);

  const filtered = filter === 'Todas' ? docs : docs.filter(d => d.category === filter);

  async function handleUpload(e) {
    e.preventDefault();
    const file = fileRef.current.files[0];
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('name', form.name || file.name);
      fd.append('type', form.type);
      fd.append('category', form.category);
      await axios.post('/api/planos/upload', fd);
      await load();
      setShowForm(false);
      setForm({ name: '', type: 'plano', category: 'estructura' });
      fileRef.current.value = '';
    } finally { setUploading(false); }
  }

  async function handleDelete(id) {
    if (!confirm('¿Eliminar documento?')) return;
    await axios.delete(`/api/planos/${id}`);
    load();
  }

  return (
    <div className="p-6 space-y-5 overflow-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Planos y Documentación</h1>
          <p className="text-slate-500 text-sm">{docs.length} documentos · Gestión documental de obra</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} className="btn-primary">
          + Subir documento
        </button>
      </div>

      {showForm && (
        <div className="card border-blue-200 border">
          <h3 className="font-semibold text-slate-700 mb-4">Subir nuevo documento</h3>
          <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Nombre</label>
              <input className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Nombre del documento" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Tipo</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}>
                {['plano','documento','informe','foto'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Categoría</label>
              <select className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                {CATEGORIES.slice(1).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Archivo</label>
              <input type="file" ref={fileRef} required className="w-full text-sm text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-medium file:bg-blue-50 file:text-blue-700" />
            </div>
            <div className="md:col-span-4 flex gap-3">
              <button type="submit" disabled={uploading} className="btn-primary">{uploading ? 'Subiendo...' : 'Subir'}</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancelar</button>
            </div>
          </form>
        </div>
      )}

      {/* Filtros */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filter === c ? 'bg-blue-700 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(doc => (
          <div key={doc.id} className="card hover:shadow-md transition-shadow group">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{TYPE_ICONS[doc.type] || '📄'}</span>
              <div className="flex items-center gap-2">
                <span className={`badge ${CAT_COLORS[doc.category] || 'bg-slate-100 text-slate-600'} capitalize`}>{doc.category}</span>
                <button onClick={() => handleDelete(doc.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all text-sm">✕</button>
              </div>
            </div>
            <h3 className="font-semibold text-slate-800 text-sm leading-tight mb-1">{doc.name}</h3>
            <p className="text-xs text-slate-400">{doc.format} · {doc.size} · {doc.date}</p>
            <p className="text-xs text-slate-400 mt-0.5">Subido por: {doc.uploaded_by}</p>
            {doc.path && (
              <a href={`/api/planos/download/${doc.id}`} className="mt-3 inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium">
                ↓ Descargar
              </a>
            )}
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="md:col-span-3 card text-center py-12 text-slate-400">
            <p className="text-4xl mb-2">📁</p>
            <p className="font-medium">No hay documentos en esta categoría</p>
          </div>
        )}
      </div>
    </div>
  );
}
