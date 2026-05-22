import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const SECTIONS = [
  {
    label: 'Principal',
    items: [
      { to: '/',             label: 'Inicio',       icon: '🏠' },
      { to: '/gantt',        label: 'Gantt',        icon: '📊' },
      { to: '/actividad',    label: 'Actividad',    icon: '⚙️' },
      { to: '/presupuestos', label: 'Presupuestos', icon: '💶' },
      { to: '/informes',     label: 'Informes',     icon: '📄' },
    ]
  },
  {
    label: 'Control de obra',
    items: [
      { to: '/planos',     label: 'Planos',     icon: '📐' },
      { to: '/calidad',    label: 'Calidad',    icon: '✅' },
      { to: '/maquinaria', label: 'Maquinaria', icon: '🚧' },
      { to: '/seguridad',  label: 'Seguridad',  icon: '🦺' },
    ]
  },
  {
    label: 'Inteligencia IA',
    items: [
      { to: '/ia-avanzada', label: 'IA Avanzada', icon: '🤖' },
    ]
  },
  {
    label: 'Documentación',
    items: [
      { to: '/bibliografia', label: 'Bibliografía', icon: '📚' },
    ]
  }
];

function SidebarContent({ onClose }) {
  return (
    <>
      <div className="px-5 py-5 border-b border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚇</span>
          <p className="text-white font-bold text-sm leading-tight">Soterramiento A5</p>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-white md:hidden p-1">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <nav className="flex-1 px-3 py-4 space-y-4 overflow-y-auto">
        {SECTIONS.map(section => (
          <div key={section.label}>
            <p className="px-3 mb-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">{section.label}</p>
            <div className="space-y-0.5">
              {section.items.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <span>{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
      <div className="px-4 py-3 border-t border-slate-700">
        <p className="text-slate-500 text-xs">v2.0.0</p>
      </div>
    </>
  );
}

export default function Layout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50">

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 bg-slate-900 flex-col shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-slate-900 flex flex-col z-50 transition-transform duration-300 ease-in-out md:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent onClose={() => setOpen(false)} />
      </aside>

      {/* Content area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Mobile top bar */}
        <header className="md:hidden flex items-center gap-3 px-4 py-3 bg-slate-900 shrink-0 shadow-md">
          <button
            onClick={() => setOpen(true)}
            className="text-white p-1 -ml-1"
            aria-label="Abrir menú"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-xl">🚇</span>
          <span className="text-white font-bold text-sm">Soterramiento A5</span>
        </header>

        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
