const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/daily', (req, res) => {
  const reports = db.get('daily_reports').sortBy('date').reverse().take(30).value();
  res.json(reports);
});

router.get('/daily/:date', (req, res) => {
  const report = db.get('daily_reports').find({ date: req.params.date }).value();
  res.json(report || {});
});

router.post('/daily', (req, res) => {
  const { date } = req.body;
  const existing = db.get('daily_reports').find({ date }).value();
  if (existing) {
    db.get('daily_reports').find({ date }).assign(req.body).write();
    res.json({ id: existing.id });
  } else {
    const id = db.nextId('daily_reports');
    db.get('daily_reports').push({ id, ...req.body, created_at: new Date().toISOString() }).write();
    res.json({ id });
  }
});

router.get('/weekly', (req, res) => {
  res.json(db.get('weekly_reports').sortBy('week_start').reverse().take(10).value());
});

router.post('/weekly/analyze', (req, res) => {
  const activities = db.get('activities').value();
  const today = new Date().toISOString().split('T')[0];
  const deviations = [];

  activities.forEach(a => {
    if (a.status === 'delayed' || (a.end_date < today && a.status !== 'completed')) {
      deviations.push({ activity: a.name, issue: 'Actividad retrasada', planned_progress: 100, real_progress: a.progress || 0, deviation: (a.progress || 0) - 100 });
    } else if ((a.progress || 0) < 40 && a.status === 'in_progress') {
      deviations.push({ activity: a.name, issue: 'Bajo rendimiento detectado', planned_progress: 60, real_progress: a.progress || 0, deviation: (a.progress || 0) - 60 });
    }
  });

  const recommendations = deviations.length > 0 ? [
    'Aumentar cuadrilla en actividades retrasadas',
    'Reorganizar actividades priorizando ruta crítica',
    'Ampliar jornada laboral si retraso supera 3 días',
    'Adelantar pedido de materiales para próximas semanas',
  ] : [];

  res.json({
    period: { start: req.body.week_start || '', end: req.body.week_end || '' },
    deviations,
    recommendations,
    summary: {
      total_activities: activities.length,
      completed: activities.filter(a => a.status === 'completed').length,
      delayed: activities.filter(a => a.status === 'delayed').length,
      avg_progress: Math.round(activities.reduce((s, a) => s + (a.progress || 0), 0) / (activities.length || 1)),
    }
  });
});

module.exports = router;
