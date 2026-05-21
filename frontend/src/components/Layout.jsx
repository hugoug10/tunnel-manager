import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Inicio', icon: '🏠' },
  { to: '/gantt', label: 'Gantt', icon: '📊' },
  { to: '/actividad', label: 'Actividad', icon: '⚙️' },
  { to: '/presupuestos', label: 'Presupuestos', icon: '💶' },
  { to: '/informes', label: 'Informes', icon: '📄' },
];

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-56 bg-slate-900 flex flex-col shrink-0">
        <div className="px-5 py-5 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🚇</span>
            <div>
              <p className="text-white font-bold text-sm leading-tight">Soterramiento A5</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
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
        </nav>
        <div className="px-4 py-3 border-t border-slate-700">
          <p className="text-slate-500 text-xs">v1.0.0 MVP</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
