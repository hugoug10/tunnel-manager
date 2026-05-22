function Block({ icon, title, description, code }) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold text-slate-800 mb-1">{icon} {title}</h2>
      <p className="text-slate-500 text-sm mb-3">{description}</p>
      <pre className="bg-slate-900 text-slate-200 rounded-xl p-4 overflow-x-auto text-xs leading-relaxed font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function BibliografiaPage() {
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto overflow-auto pb-20 space-y-2">

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">📋 Bibliografía técnica</h1>
        <p className="text-slate-400 text-sm mt-1">Cómo se ha construido cada parte del programa</p>
      </div>

      <Block
        icon="🏠" title="Inicio — Panel de resumen"
        description="Al abrir la página se piden los datos al servidor al mismo tiempo. Si el servidor no responde, se muestran ceros en lugar de un error."
        code={`Promise.all([
  activitiesApi.getSummary(),
  activitiesApi.getAll(),
]).then(([stats, activities]) => {
  setStats(stats);
  setActivities(activities);
}).catch(() => {
  setStats({ total: 0, completed: 0, delayed: 0 });
});`}
      />

      <Block
        icon="📊" title="Gantt — Calendario visual"
        description="El diagrama se dibuja calculando manualmente la posición y el ancho de cada barra según los días de inicio y duración de cada tarea."
        code={`// Posición horizontal de la barra (en píxeles)
const startOff = dateDiff(RANGE_START, act.start_date);
const barWidth = (dateDiff(act.start_date, act.end_date) + 1) * DAY_WIDTH;

<div style={{ left: startOff * DAY_WIDTH, width: barWidth }} />`}
      />

      <Block
        icon="⚙️" title="Actividades — Edición de tareas"
        description="Cada tarea se puede editar en un formulario emergente. Al guardar, los cambios se envían al servidor y la lista se actualiza sola."
        code={`async function guardar() {
  await activitiesApi.update(tarea.id, formulario);
  recargarLista();
  cerrarFormulario();
}

// Desviación en días respecto al plan
const desviacion = diasReales - diasPlanificados;`}
      />

      <Block
        icon="💶" title="Presupuestos — Calculadora con IVA"
        description="Cada vez que el usuario cambia el material o la cantidad, el precio se recalcula automáticamente aplicando el IVA del 21%."
        code={`useEffect(() => {
  const base  = material.precio * cantidad;
  const iva   = base * 0.21;
  setResultado({ base, iva, total: base + iva });
}, [material, cantidad]);`}
      />

      <Block
        icon="📄" title="Informes — Partes diarios"
        description="Al cambiar la fecha, el programa carga el parte ya guardado para ese día. Si no existe, muestra el formulario vacío listo para rellenar."
        code={`useEffect(() => {
  reportsApi.getDaily(fecha).then(data => {
    if (data?.id) setFormulario(data);   // carga el parte existente
    else          setFormulario(VACIO);  // formulario limpio
  });
}, [fecha]);`}
      />

      <Block
        icon="📐" title="Planos — Subida de archivos"
        description="Los archivos se envían al servidor usando un formulario especial que permite adjuntar ficheros. El servidor los guarda y registra sus datos."
        code={`const datos = new FormData();
datos.append('archivo',   archivo);
datos.append('tipo',      formulario.tipo);
datos.append('categoria', formulario.categoria);

await axios.post('/api/planos', datos);`}
      />

      <Block
        icon="✅" title="Calidad — Ensayos automáticos"
        description="El servidor compara el resultado obtenido con el valor mínimo exigido y marca el ensayo como conforme o no conforme automáticamente."
        code={`// En el servidor: determina si el ensayo pasa o falla
const estado = resultado >= minimo ? 'ok' : 'nok';

// En la pantalla: filtra por estado con los botones
const filtrados = ensayos.filter(e => e.estado === filtroActivo);`}
      />

      <Block
        icon="🚧" title="Maquinaria — Control de equipos"
        description="Se registra una jornada por cada máquina cada día. El programa acumula las horas y el combustible, y avisa si una máquina tiene demasiadas averías."
        code={`// Alerta si la tasa de averías supera el 20%
const tasaAverias = (averias / totalJornadas) * 100;
const tieneAlerta = tasaAverias > 20;`}
      />

      <Block
        icon="🦺" title="Seguridad — Incidencias"
        description="Se registran accidentes, casi-accidentes e inspecciones. Cada incidencia puede cerrarse cuando se resuelve, cambiando su estado en el servidor."
        code={`async function cerrarIncidencia(id) {
  await axios.put(\`/api/seguridad/\${id}\`, { estado: 'cerrada' });
  recargarLista();
}`}
      />

      <Block
        icon="🤖" title="IA Avanzada — Chat con la obra"
        description="El usuario escribe una pregunta, se envía al servidor con el contexto actual de la obra, y el servidor devuelve una respuesta generada con esos datos."
        code={`async function enviarMensaje(texto) {
  setMensajes(m => [...m, { rol: 'usuario', texto }]);
  const respuesta = await axios.post('/api/ia/chat', { mensaje: texto });
  setMensajes(m => [...m, { rol: 'asistente', texto: respuesta.data.respuesta }]);
}`}
      />

      <div className="text-center text-slate-300 text-xs pt-6 border-t border-slate-100 mt-4">
        Gestor de Obra — Soterramiento A5 · TFG
      </div>
    </div>
  );
}
