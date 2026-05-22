import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard    from './pages/Dashboard';
import GanttPage    from './pages/GanttPage';
import ActivityPage from './pages/ActivityPage';
import BudgetPage   from './pages/BudgetPage';
import ReportsPage  from './pages/ReportsPage';
import PlanosPage   from './pages/PlanosPage';
import CalidadPage  from './pages/CalidadPage';
import MaquinariaPage from './pages/MaquinariaPage';
import SeguridadPage  from './pages/SeguridadPage';
import IAProPage       from './pages/IAProPage';
import BibliografiaPage from './pages/BibliografiaPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index               element={<Dashboard />} />
          <Route path="gantt"        element={<GanttPage />} />
          <Route path="actividad"    element={<ActivityPage />} />
          <Route path="presupuestos" element={<BudgetPage />} />
          <Route path="informes"     element={<ReportsPage />} />
          <Route path="planos"       element={<PlanosPage />} />
          <Route path="calidad"      element={<CalidadPage />} />
          <Route path="maquinaria"   element={<MaquinariaPage />} />
          <Route path="seguridad"    element={<SeguridadPage />} />
          <Route path="ia-avanzada"   element={<IAProPage />} />
          <Route path="bibliografia"  element={<BibliografiaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
