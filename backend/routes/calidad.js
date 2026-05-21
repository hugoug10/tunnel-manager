const express = require('express');
const router  = express.Router();
const db      = require('../database');

router.get('/', (req, res) => {
  const tests = db.get('quality_tests').value();
  const activities = db.get('activities').value();
  const enriched = tests.map(t => ({
    ...t,
    activity_name: activities.find(a => a.id === t.activity_id)?.name || '—',
    passed: t.status === 'ok',
  }));
  res.json(enriched);
});

router.get('/stats', (req, res) => {
  const tests = db.get('quality_tests').value();
  const total  = tests.length;
  const passed = tests.filter(t => t.status === 'ok').length;
  const failed = tests.filter(t => t.status === 'nok').length;
  const by_type = Object.entries(
    tests.reduce((acc, t) => { acc[t.type] = (acc[t.type] || 0) + 1; return acc; }, {})
  ).map(([type, count]) => ({ type, count }));

  const nok_list = tests.filter(t => t.status === 'nok');
  res.json({ total, passed, failed, pass_rate: total > 0 ? Math.round((passed/total)*100) : 0, by_type, nok_list });
});

router.post('/', (req, res) => {
  const id = db.nextId('quality_tests');
  db.get('quality_tests').push({ id, ...req.body, status: parseFloat(req.body.result) >= parseFloat(req.body.min_value) ? 'ok' : 'nok' }).write();
  res.json({ id });
});

router.put('/:id', (req, res) => {
  const body = { ...req.body, status: parseFloat(req.body.result) >= parseFloat(req.body.min_value) ? 'ok' : 'nok' };
  db.get('quality_tests').find({ id: parseInt(req.params.id) }).assign(body).write();
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.get('quality_tests').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

module.exports = router;
