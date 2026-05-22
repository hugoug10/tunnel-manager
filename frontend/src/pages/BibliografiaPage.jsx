function Section({ id, title, children }) {
  return (
    <section id={id} className="mb-10">
      <h2 className="text-xl font-bold text-blue-800 border-l-4 border-blue-500 pl-4 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function CodeBlock({ children }) {
  return (
    <pre className="bg-slate-900 text-slate-200 rounded-xl p-5 overflow-x-auto text-xs leading-relaxed my-4 font-mono">
      <code>{children}</code>
    </pre>
  );
}

function InfoBox({ children }) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-5 py-4 my-4 text-blue-800 text-sm">
      {children}
    </div>
  );
}

function ModuleCard({ icon, title, children }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5 bg-slate-50 mb-4">
      <h3 className="font-bold text-blue-700 mb-2">{icon} {title}</h3>
      {children}
    </div>
  );
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-x-auto my-4">
      <table className="w-full text-sm border-collapse min-w-[400px]">
        <thead>
          <tr>
            {headers.map(h => (
              <th key={h} className="bg-blue-800 text-white px-4 py-2 text-left font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2 border-b border-slate-200 text-slate-700" dangerouslySetInnerHTML={{ __html: cell }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const TOC = [
  'Descripción general del proyecto',
  'Tecnologías utilizadas',
  'Estructura del proyecto',
  'Módulo: Inicio (Dashboard)',
  'Módulo: Diagrama de Gantt',
  'Módulo: Gestión de Actividades',
  'Módulo: Presupuestos',
  'Módulo: Informes',
  'Módulo: Planos y Documentación',
  'Módulo: Control de Calidad',
  'Módulo: Maquinaria',
  'Módulo: Seguridad y Salud',
  'Módulo: IA Avanzada',
  'Base de datos y almacenamiento',
  'Servidor y API',
  'Despliegue en Railway',
  'Protección con contraseña',
];

export default function BibliografiaPage() {
  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto overflow-auto pb-20">

      {/* Portada */}
      <div className="text-center py-10 mb-10 border-b-2 border-slate-200">
        <div className="text-6xl mb-4">🚇</div>
        <h1 className="text-3xl font-bold text-slate-900">Gestor de Obra — Soterramiento A5</h1>
        <p className="text-lg text-slate-500 mt-2">Trabajo de Fin de Grado</p>
        <p className="text-slate-400 mt-1">Aplicación web para la gestión del Túnel Yébenes</p>
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">React</span>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Node.js</span>
          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">Express</span>
          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">Railway</span>
        </div>
      </div>

      {/* Índice */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 mb-10">
        <h3 className="font-bold text-slate-700 mb-3">Índice de contenidos</h3>
        <ol className="list-decimal list-inside space-y-1">
          {TOC.map((item, i) => (
            <li key={i} className="text-blue-600 text-sm">{item}</li>
          ))}
        </ol>
      </div>

      {/* 1 */}
      <Section id="s1" title="1. Descripción general del proyecto">
        <p className="text-slate-600 mb-3">
          El <strong>Gestor de Obra Soterramiento A5</strong> es una aplicación web desarrollada para gestionar en tiempo real todas las áreas de una obra de tunelería: actividades, presupuestos, maquinaria, seguridad, calidad, planos e inteligencia artificial aplicada a la predicción de retrasos.
        </p>
        <p className="text-slate-600 mb-3">La aplicación tiene dos partes claramente diferenciadas:</p>
        <ul className="list-disc list-inside space-y-1 text-slate-600 text-sm mb-3">
          <li><strong>Frontend</strong>: la interfaz visual que ve el usuario en el navegador, construida con React.</li>
          <li><strong>Backend</strong>: el servidor que gestiona los datos y los guarda, construido con Node.js y Express.</li>
        </ul>
        <InfoBox>
          <strong>Acceso a la aplicación:</strong> La web está protegida por contraseña. Al entrar, se muestra una pantalla de login donde el usuario debe introducir la clave correcta para acceder a todos los módulos.
        </InfoBox>
      </Section>

      {/* 2 */}
      <Section id="s2" title="2. Tecnologías utilizadas">
        <Table
          headers={['Tecnología', 'Para qué se usa', 'Tipo']}
          rows={[
            ['<strong>React</strong>', 'Construir la interfaz visual del navegador', '<span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:20px;font-size:12px">Frontend</span>'],
            ['<strong>Vite</strong>', 'Herramienta que empaqueta y prepara el proyecto para publicarlo', '<span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:20px;font-size:12px">Frontend</span>'],
            ['<strong>Tailwind CSS</strong>', 'Sistema de estilos visuales (colores, tamaños, layouts)', '<span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:20px;font-size:12px">Frontend</span>'],
            ['<strong>Recharts</strong>', 'Librería para generar gráficas y diagramas', '<span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:20px;font-size:12px">Frontend</span>'],
            ['<strong>Axios</strong>', 'Realiza las peticiones al servidor para obtener o guardar datos', '<span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:20px;font-size:12px">Frontend</span>'],
            ['<strong>jsPDF</strong>', 'Generación de documentos PDF desde el navegador', '<span style="background:#dbeafe;color:#1d4ed8;padding:2px 8px;border-radius:20px;font-size:12px">Frontend</span>'],
            ['<strong>Node.js</strong>', 'Entorno de ejecución del servidor', '<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:20px;font-size:12px">Backend</span>'],
            ['<strong>Express</strong>', 'Framework que gestiona las rutas del servidor (API)', '<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:20px;font-size:12px">Backend</span>'],
            ['<strong>LowDB</strong>', 'Base de datos en formato JSON, sin instalación extra', '<span style="background:#fef3c7;color:#92400e;padding:2px 8px;border-radius:20px;font-size:12px">Backend</span>'],
            ['<strong>Railway</strong>', 'Plataforma donde está desplegada la aplicación en internet', '<span style="background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:20px;font-size:12px">Despliegue</span>'],
          ]}
        />
      </Section>

      {/* 3 */}
      <Section id="s3" title="3. Estructura del proyecto">
        <p className="text-slate-600 mb-3">El proyecto está organizado en dos carpetas principales:</p>
        <CodeBlock>{`tunnel-manager/
│
├── frontend/               ← Interfaz de usuario (React)
│   ├── src/
│   │   ├── pages/          ← Una página por módulo (Dashboard, Gantt, etc.)
│   │   ├── components/     ← Piezas reutilizables (menú lateral, botones, etc.)
│   │   └── services/       ← Funciones que se comunican con el servidor
│   └── package.json
│
├── backend/                ← Servidor de datos (Node.js)
│   ├── routes/             ← Una ruta por cada módulo de la API
│   ├── server.js           ← Punto de entrada del servidor
│   └── database.js         ← Configuración de la base de datos
│
└── package.json            ← Script de construcción y arranque global`}</CodeBlock>
        <p className="text-slate-600 text-sm">
          Cuando el proyecto se despliega en Railway, el servidor construye primero el frontend y luego lo sirve junto a la API, todo desde una única URL.
        </p>
      </Section>

      {/* 4 */}
      <Section id="s4" title="4. Módulo: Inicio (Dashboard)">
        <ModuleCard icon="🏠" title="¿Qué hace?">
          <p className="text-slate-600 text-sm">Es la primera pantalla al entrar. Muestra el porcentaje de avance total, actividades completadas, en curso y retrasadas, un gráfico circular con el estado de las tareas y un gráfico de barras con el progreso por actividad. Si hay retrasos, muestra alertas en rojo.</p>
        </ModuleCard>
        <h4 className="font-semibold text-slate-700 mb-2">¿Cómo funciona?</h4>
        <p className="text-slate-600 text-sm mb-2">Al cargar la página, se hacen dos peticiones simultáneas al servidor: una para el resumen estadístico y otra para la lista de actividades. Si el servidor no responde, muestra ceros en lugar de quedarse en blanco.</p>
        <CodeBlock>{`// Carga paralela de datos al abrir la página
useEffect(() => {
  Promise.all([
    activitiesApi.getSummary(),   // estadísticas globales
    activitiesApi.getAll(),        // lista de actividades
  ]).then(([s, a]) => {
    setStats(s);
    setActivities(a);
  }).catch(() => {
    // Si falla la conexión, muestra ceros en lugar de pantalla en blanco
    setStats({ total: 0, completed: 0, in_progress: 0, delayed: 0 });
    setActivities([]);
  });
}, []);`}</CodeBlock>
      </Section>

      {/* 5 */}
      <Section id="s5" title="5. Módulo: Diagrama de Gantt">
        <ModuleCard icon="📊" title="¿Qué hace?">
          <p className="text-slate-600 text-sm">Calendario visual de dos meses (abril–mayo 2026). Cada actividad es una barra de color sobre los días que le corresponden. Los fines de semana aparecen sombreados y una línea azul marca el día de hoy. Las actividades críticas llevan el símbolo ★.</p>
        </ModuleCard>
        <h4 className="font-semibold text-slate-700 mb-2">¿Cómo funciona?</h4>
        <p className="text-slate-600 text-sm mb-2">El diagrama se construye desde código sin usar librerías externas de Gantt. Se calcula la posición en píxeles de cada barra según la fecha de inicio y duración de la actividad.</p>
        <CodeBlock>{`// Cálculo de la posición y ancho de cada barra
const startOff = dateDiff(RANGE_START, act.start_date); // días desde inicio
const barW     = (dateDiff(act.start_date, act.end_date) + 1) * DAY_W;

// La barra se posiciona absolutamente en el eje horizontal
<div style={{ left: startOff * DAY_W, width: barW, background: sc.bar }} />`}</CodeBlock>
      </Section>

      {/* 6 */}
      <Section id="s6" title="6. Módulo: Gestión de Actividades">
        <ModuleCard icon="⚙️" title="¿Qué hace?">
          <p className="text-slate-600 text-sm">Lista todas las tareas con filtros por estado. Al hacer clic en una actividad se abre un formulario para actualizar: estado, porcentaje de progreso, fechas reales, días ejecutados, rendimiento diario y observaciones. Muestra en números la desviación en días respecto a lo planificado.</p>
        </ModuleCard>
        <h4 className="font-semibold text-slate-700 mb-2">¿Cómo funciona?</h4>
        <CodeBlock>{`// Al guardar el formulario, actualiza en el servidor y recarga la lista
async function handleSave() {
  await activitiesApi.update(activity.id, { ...activity, ...form });
  onSave();   // recarga la lista
  onClose();  // cierra el formulario emergente
}

// Cálculo de la desviación en días respecto al plan
const deviation = act.real_days > 0 ? act.real_days - act.duration : 0;`}</CodeBlock>
      </Section>

      {/* 7 */}
      <Section id="s7" title="7. Módulo: Presupuestos">
        <ModuleCard icon="💶" title="¿Qué hace?">
          <p className="text-slate-600 text-sm">Módulo económico con cuatro pestañas: <strong>Calculadora</strong> (calcula coste con IVA al instante), <strong>Semanal</strong> (previsto vs real por semana), <strong>Mensual</strong> (evolución acumulada), y <strong>Resumen + IA</strong> (análisis global con exportación a PDF y Excel).</p>
        </ModuleCard>
        <h4 className="font-semibold text-slate-700 mb-2">¿Cómo funciona?</h4>
        <CodeBlock>{`// Cálculo en tiempo real cuando cambia material o cantidad
useEffect(() => {
  if (!mat || !qty || parseFloat(qty) <= 0) { setResult(null); return; }
  const base = mat.price * parseFloat(qty);
  const iva  = base * 0.21; // IVA del 21%
  setResult({ base, iva, total: base + iva });
}, [matId, qty, mat]);`}</CodeBlock>
      </Section>

      {/* 8 */}
      <Section id="s8" title="8. Módulo: Informes">
        <ModuleCard icon="📄" title="¿Qué hace?">
          <p className="text-slate-600 text-sm">Genera y guarda partes diarios (trabajos, incidencias, materiales, personal, meteorología) e informes semanales. Ambos se pueden exportar a PDF con un clic.</p>
        </ModuleCard>
        <h4 className="font-semibold text-slate-700 mb-2">¿Cómo funciona?</h4>
        <p className="text-slate-600 text-sm mb-2">Al cambiar la fecha, carga automáticamente el parte ya guardado para ese día si existe. El PDF se genera en el navegador con jsPDF sin necesitar servidor externo.</p>
        <CodeBlock>{`// Al cambiar la fecha, carga el parte existente si lo hay
useEffect(() => {
  reportsApi.getDaily(date).then(data => {
    if (data && data.id) setForm({ ...form, ...data });
    else setForm(EMPTY_FORM); // si no hay parte, limpia el formulario
  }).catch(() => {});
}, [date]);`}</CodeBlock>
      </Section>

      {/* 9 */}
      <Section id="s9" title="9. Módulo: Planos y Documentación">
        <ModuleCard icon="📐" title="¿Qué hace?">
          <p className="text-slate-600 text-sm">Repositorio de documentos técnicos. Permite subir archivos (planos, fotos, informes), clasificarlos por categoría y buscarlos por nombre.</p>
        </ModuleCard>
        <h4 className="font-semibold text-slate-700 mb-2">¿Cómo funciona?</h4>
        <CodeBlock>{`// Subida de archivo al servidor
const formData = new FormData();
formData.append('file', selectedFile);
formData.append('type', form.type);
formData.append('category', form.category);
await axios.post('/api/planos', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});`}</CodeBlock>
      </Section>

      {/* 10 */}
      <Section id="s10" title="10. Módulo: Control de Calidad">
        <ModuleCard icon="✅" title="¿Qué hace?">
          <p className="text-slate-600 text-sm">Registro de ensayos (probetas de hormigón, compactación, resistencia del acero, etc.). El sistema determina automáticamente si el ensayo es conforme ✅, no conforme ❌ o pendiente ⏳, comparando el resultado con el mínimo requerido.</p>
        </ModuleCard>
        <h4 className="font-semibold text-slate-700 mb-2">¿Cómo funciona?</h4>
        <CodeBlock>{`// El servidor calcula si el ensayo pasa o falla
const status = result >= min_value ? 'ok' : 'nok';

// El frontend filtra por estado con botones
const filtered = filter === 'todos'
  ? tests
  : tests.filter(t => t.status === filter);`}</CodeBlock>
      </Section>

      {/* 11 */}
      <Section id="s11" title="11. Módulo: Maquinaria">
        <ModuleCard icon="🚧" title="¿Qué hace?">
          <p className="text-slate-600 text-sm">Control diario del parque de maquinaria. Registra por jornada: máquina, operador, horas trabajadas, litros de combustible y estado. Genera alertas automáticas si la tasa de averías de un equipo supera el 20%.</p>
        </ModuleCard>
        <h4 className="font-semibold text-slate-700 mb-2">¿Cómo funciona?</h4>
        <CodeBlock>{`// Máquinas disponibles en la obra
const MACHINES = [
  'Tuneladora TBM-1', 'Excavadora CAT 390',
  'Volquete Scania R450', 'Bomba de hormigón Schwing',
  'Grúa Liebherr LTM1100', 'Compresor Atlas Copco'
];

// Alerta si la tasa de averías supera el 20%
const hasAlert = breakdownRate > 20;`}</CodeBlock>
      </Section>

      {/* 12 */}
      <Section id="s12" title="12. Módulo: Seguridad y Salud">
        <ModuleCard icon="🦺" title="¿Qué hace?">
          <p className="text-slate-600 text-sm">Registro de accidentes, casi-accidentes e inspecciones. Para cada incidencia: ubicación, descripción, gravedad, si hubo lesionados y acción correctora. Las incidencias pueden cerrarse cuando se resuelven. Genera análisis automáticos de patrones de riesgo.</p>
        </ModuleCard>
        <h4 className="font-semibold text-slate-700 mb-2">¿Cómo funciona?</h4>
        <CodeBlock>{`// Tipos de incidencia con su color
const TYPE_COLORS = {
  accidente:        'bg-red-100 text-red-700',
  'casi-accidente': 'bg-amber-100 text-amber-700',
  inspección:       'bg-blue-100 text-blue-700'
};

// Cerrar una incidencia actualiza su estado
async function handleClose(id) {
  await axios.put(\`/api/seguridad/\${id}\`, { status: 'cerrada' });
  load(); // recarga la lista
}`}</CodeBlock>
      </Section>

      {/* 13 */}
      <Section id="s13" title="13. Módulo: IA Avanzada">
        <ModuleCard icon="🤖" title="¿Qué hace?">
          <p className="text-slate-600 text-sm">Tres herramientas: <strong>Predicción de retrasos</strong> (estima la fecha real de fin de cada actividad), <strong>Optimizador de recursos</strong> (detecta cuellos de botella y sugiere acciones) y <strong>Chat con la obra</strong> (asistente al que puedes preguntar en lenguaje natural sobre el estado de la obra).</p>
        </ModuleCard>
        <h4 className="font-semibold text-slate-700 mb-2">¿Cómo funciona?</h4>
        <CodeBlock>{`// Envío de un mensaje al chat de la obra
async function send(text) {
  const msg = text || input.trim();
  if (!msg) return;
  setMessages(m => [...m, { role: 'user', text: msg }]);
  setLoading(true);
  try {
    const r = await axios.post('/api/ia/chat', { message: msg });
    setMessages(m => [...m, { role: 'assistant', text: r.data.answer }]);
  } finally { setLoading(false); }
}`}</CodeBlock>
      </Section>

      {/* 14 */}
      <Section id="s14" title="14. Base de datos y almacenamiento">
        <p className="text-slate-600 mb-3">La aplicación usa <strong>LowDB</strong>, una base de datos basada en un archivo JSON. Todos los datos se guardan en un único archivo <code className="bg-slate-100 px-1 rounded text-xs">tunnel-db.json</code> sin necesidad de instalar ningún sistema externo.</p>
        <CodeBlock>{`{
  "activities":  [ ... ],   // actividades de obra
  "reports":     { ... },   // partes diarios y semanales
  "materials":   [ ... ],   // materiales consumidos
  "budget":      { ... },   // partidas presupuestarias
  "planos":      [ ... ],   // documentos subidos
  "calidad":     [ ... ],   // ensayos de calidad
  "maquinaria":  [ ... ],   // jornadas de maquinaria
  "seguridad":   [ ... ]    // incidencias de seguridad
}`}</CodeBlock>
      </Section>

      {/* 15 */}
      <Section id="s15" title="15. Servidor y API">
        <p className="text-slate-600 mb-3">El servidor expone una API REST: rutas (URLs) a las que el frontend llama para leer o guardar datos. Cada módulo tiene su propio archivo de rutas.</p>
        <Table
          headers={['Método', 'Ruta', 'Qué hace']}
          rows={[
            ['GET',  '/api/activities',             'Devuelve todas las actividades'],
            ['PUT',  '/api/activities/:id',          'Actualiza una actividad'],
            ['GET',  '/api/activities/stats/summary','Devuelve el resumen estadístico'],
            ['POST', '/api/reports/daily',           'Guarda un parte diario'],
            ['POST', '/api/calidad',                 'Registra un nuevo ensayo'],
            ['GET',  '/api/maquinaria/stats',        'Devuelve estadísticas de maquinaria'],
            ['POST', '/api/ia/chat',                 'Procesa una pregunta del chat IA'],
          ]}
        />
        <CodeBlock>{`// El servidor sirve tanto la API como la interfaz web
app.use('/api/activities', require('./routes/activities'));
app.use('/api/calidad',    require('./routes/calidad'));
// ... más rutas

// Sirve los archivos del frontend para cualquier otra ruta
app.use(express.static(distPath));
app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));`}</CodeBlock>
      </Section>

      {/* 16 */}
      <Section id="s16" title="16. Despliegue en Railway">
        <p className="text-slate-600 mb-3">La aplicación está publicada en <strong>Railway</strong>, que conecta directamente con GitHub. Cada vez que se sube un cambio, Railway lo detecta y redespliega automáticamente.</p>
        <CodeBlock>{`// package.json raíz — define cómo construir y arrancar la app
{
  "scripts": {
    // 1. Construye: instala dependencias y compila el frontend
    "build": "cd backend && npm install && cd ../frontend && npm install && npm run build",
    // 2. Arranca: inicia el servidor Express
    "start": "node backend/server.js"
  }
}`}</CodeBlock>
        <InfoBox>
          <strong>Flujo de despliegue:</strong> Subir código a GitHub → Railway detecta el cambio → Ejecuta <code>npm run build</code> → Ejecuta <code>npm start</code> → App disponible en la URL pública.
        </InfoBox>
      </Section>

      {/* 17 */}
      <Section id="s17" title="17. Protección con contraseña">
        <p className="text-slate-600 mb-3">La web está protegida mediante un sistema de login con cookies. Al entrar, si el usuario no se ha identificado, se le redirige a la pantalla de login. Al introducir la contraseña correcta, se crea una cookie válida durante 7 días.</p>
        <CodeBlock>{`// Si la contraseña es correcta, crea una cookie válida 7 días
app.post('/login', (req, res) => {
  if (req.body.password === PASSWORD) {
    res.cookie('tm_auth', AUTH_VALUE, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días en milisegundos
    });
    res.redirect('/');
  } else {
    res.redirect('/login?error=1');
  }
});

// Middleware que protege TODAS las rutas de la aplicación
app.use((req, res, next) => {
  if (req.cookies.tm_auth === AUTH_VALUE) return next(); // cookie válida → pasa
  res.redirect('/login');                                // sin cookie → login
});`}</CodeBlock>
      </Section>

      <div className="text-center text-slate-400 text-sm pt-6 border-t border-slate-200 mt-10">
        Documentación técnica — Gestor de Obra Soterramiento A5 · Túnel Yébenes
      </div>
    </div>
  );
}
