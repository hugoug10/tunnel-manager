const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const adapter = new FileSync(path.join(__dirname, 'tunnel-db.json'));
const db = low(adapter);

const INITIAL_ACTIVITIES = [
  { id: 1, name: 'Excavación Túnel entrada (Yébenes) PK 1+940 a 1+675', start_date: '2026-04-01', end_date: '2026-04-25', duration: 25, status: 'in_progress', progress: 60, is_critical: 1, depends_on: null, real_start: '2026-04-01', real_end: null, real_days: 15, observations: '', daily_yield: 10.5, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 2, name: 'Gunitado Túnel entrada (Yébenes) PK 1+940 a 1+675', start_date: '2026-04-10', end_date: '2026-05-05', duration: 26, status: 'in_progress', progress: 30, is_critical: 1, depends_on: '1', real_start: '2026-04-12', real_end: null, real_days: 10, observations: '', daily_yield: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 3, name: 'Drenaje Túnel entrada (Yébenes) PK 1+940 a 1+675', start_date: '2026-04-15', end_date: '2026-05-10', duration: 26, status: 'pending', progress: 0, is_critical: 0, depends_on: '1', real_start: null, real_end: null, real_days: 0, observations: '', daily_yield: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 4, name: 'Losa inferior (incluye geotermia) Túnel entrada (Yébenes)', start_date: '2026-04-20', end_date: '2026-05-15', duration: 26, status: 'pending', progress: 0, is_critical: 1, depends_on: '2,3', real_start: null, real_end: null, real_days: 0, observations: '', daily_yield: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 5, name: 'Muro forro Túnel entrada (Yébenes)', start_date: '2026-05-01', end_date: '2026-05-20', duration: 20, status: 'pending', progress: 0, is_critical: 1, depends_on: '4', real_start: null, real_end: null, real_days: 0, observations: '', daily_yield: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 6, name: 'Estructura Vitrex Túnel entrada (Yébenes)', start_date: '2026-05-10', end_date: '2026-05-28', duration: 19, status: 'pending', progress: 0, is_critical: 0, depends_on: '4', real_start: null, real_end: null, real_days: 0, observations: '', daily_yield: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 7, name: 'Bordillo y acera Túnel entrada (Yébenes)', start_date: '2026-05-15', end_date: '2026-05-30', duration: 16, status: 'pending', progress: 0, is_critical: 0, depends_on: '5', real_start: null, real_end: null, real_days: 0, observations: '', daily_yield: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 8, name: 'Canalizaciones en acera (prisma Telec)', start_date: '2026-05-18', end_date: '2026-05-31', duration: 14, status: 'pending', progress: 0, is_critical: 0, depends_on: '7', real_start: null, real_end: null, real_days: 0, observations: '', daily_yield: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
  { id: 9, name: 'Reposición Cruce 1+770 Red Eléctrica (aéreo)', start_date: '2026-04-05', end_date: '2026-04-20', duration: 16, status: 'delayed', progress: 20, is_critical: 0, depends_on: null, real_start: '2026-04-05', real_end: null, real_days: 5, observations: 'Retraso por permisos de compañía eléctrica', daily_yield: 0, created_at: new Date().toISOString(), updated_at: new Date().toISOString() },
];

db.defaults({
  activities: INITIAL_ACTIVITIES,
  materials: [],
  daily_reports: [],
  weekly_reports: [],
  users: [],
  _nextId: { activities: 10, materials: 1, daily_reports: 1, weekly_reports: 1 }
}).write();

// ID generator
db.nextId = function(collection) {
  const current = db.get(`_nextId.${collection}`).value();
  db.set(`_nextId.${collection}`, current + 1).write();
  return current;
};

module.exports = db;
