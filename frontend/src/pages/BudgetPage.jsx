export default function BudgetPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-slate-900">Presupuestos</h1>
      <p className="text-slate-500 text-sm mt-1">Módulo en desarrollo</p>
      <div className="mt-8 card flex flex-col items-center justify-center py-20 text-center">
        <span className="text-5xl mb-4">💶</span>
        <h2 className="text-xl font-semibold text-slate-700">Módulo de Presupuestos</h2>
        <p className="text-slate-400 mt-2 max-w-md">
          Próximamente: control de costes, comparativas planificado vs real,
          gestión de partidas presupuestarias y control de desviaciones económicas.
        </p>
        <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-lg">
          {['Coste planificado', 'Coste real', 'Desviación'].map(label => (
            <div key={label} className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-slate-300">—</p>
              <p className="text-xs text-slate-400 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
