# Tunnel Manager — Gestión Obra Túnel Yébenes

## Arranque rápido

### Opción 1: Script automático
```
doble clic en start.bat
```

### Opción 2: Manual

**Backend** (terminal 1):
```bash
cd backend
npm install
npm start
# → http://localhost:3001
```

**Frontend** (terminal 2):
```bash
cd frontend
npm install
npm run dev
# → http://localhost:3000
```

## Estructura
```
tunnel-manager/
├── backend/
│   ├── server.js          # Express + rutas
│   ├── database.js        # SQLite + seed inicial
│   ├── routes/
│   │   ├── activities.js  # CRUD actividades + stats
│   │   ├── reports.js     # Informes diarios y semanales
│   │   └── materials.js   # CRUD materiales
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/Layout.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # KPIs + gráficos
│   │   │   ├── GanttPage.jsx    # Gantt custom Abr-May 2026
│   │   │   ├── ActivityPage.jsx # Gestión producción real
│   │   │   ├── BudgetPage.jsx   # Placeholder
│   │   │   └── ReportsPage.jsx  # Diario PDF + Semanal IA
│   │   └── services/api.js      # Axios client
│   └── package.json
└── start.bat
```

## API endpoints
- `GET/POST/PUT/DELETE /api/activities`
- `GET /api/activities/stats/summary`
- `GET/POST /api/reports/daily`
- `POST /api/reports/weekly/analyze`
- `GET/POST/PUT/DELETE /api/materials`
