import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import PageLoader, { DashboardSkeleton, GanttSkeleton, TableSkeleton, ReportsSkeleton } from './components/PageLoader';

const Dashboard    = lazy(() => import('./pages/Dashboard'));
const GanttPage    = lazy(() => import('./pages/GanttPage'));
const ActivityPage = lazy(() => import('./pages/ActivityPage'));
const BudgetPage   = lazy(() => import('./pages/BudgetPage'));
const ReportsPage  = lazy(() => import('./pages/ReportsPage'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index             element={<Suspense fallback={<DashboardSkeleton />}><Dashboard /></Suspense>} />
          <Route path="gantt"      element={<Suspense fallback={<GanttSkeleton />}><GanttPage /></Suspense>} />
          <Route path="actividad"  element={<Suspense fallback={<TableSkeleton />}><ActivityPage /></Suspense>} />
          <Route path="presupuestos" element={<Suspense fallback={<PageLoader />}><BudgetPage /></Suspense>} />
          <Route path="informes"   element={<Suspense fallback={<ReportsSkeleton />}><ReportsPage /></Suspense>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
