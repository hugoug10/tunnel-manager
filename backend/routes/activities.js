const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/stats/summary', (req, res) => {
  const activities = db.get('activities').value();
  const today = new Date().toISOString().split('T')[0];
  const total = activities.length;
  const completed = activities.filter(a => a.status === 'completed').length;
  const delayed = activities.filter(a => a.status === 'delayed' || (a.end_date < today && a.status !== 'completed')).length;
  const in_progress = activities.filter(a => a.status === 'in_progress').length;
  const pending = activities.filter(a => a.status === 'pending').length;
  const avg_progress = Math.round(activities.reduce((s, a) => s + (a.progress || 0), 0) / (activities.length || 1));
  const upcoming = activities.filter(a => a.start_date >= today && a.status === 'pending').sort((a, b) => a.start_date.localeCompare(b.start_date)).slice(0, 3);
  const delayed_list = activities.filter(a => a.status === 'delayed' || (a.end_date < today && a.status !== 'completed'));
  res.json({ total, completed, delayed, in_progress, pending, avg_progress, upcoming, delayed_list });
});

router.get('/', (req, res) => {
  const activities = db.get('activities').sortBy('start_date').value();
  res.json(activities);
});

router.get('/:id', (req, res) => {
  const activity = db.get('activities').find({ id: parseInt(req.params.id) }).value();
  if (!activity) return res.status(404).json({ error: 'Not found' });
  res.json(activity);
});

router.post('/', (req, res) => {
  const id = db.nextId('activities');
  const now = new Date().toISOString();
  const activity = { id, ...req.body, created_at: now, updated_at: now };
  db.get('activities').push(activity).write();
  res.json({ id });
});

router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id);
  db.get('activities').find({ id }).assign({ ...req.body, id, updated_at: new Date().toISOString() }).write();
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.get('activities').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

module.exports = router;
