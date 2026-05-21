const express = require('express');
const router  = express.Router();
const db      = require('../database');

router.get('/', (req, res) => {
  const logs = db.get('machinery_logs').sortBy('date').reverse().value();
  const activities = db.get('activities').value();
  res.json(logs.map(l => ({
    ...l, activity_name: activities.find(a => a.id === l.activity_id)?.name || '—'
  })));
});

router.get('/stats', (req, res) => {
  const logs = db.get('machinery_logs').value();
  const total_hours  = logs.reduce((s, l) => s + (l.hours || 0), 0);
  const total_fuel   = logs.reduce((s, l) => s + (l.fuel_liters || 0), 0);
  const breakdowns   = logs.filter(l => l.status === 'avería').length;

  const by_machine = Object.values(
    logs.reduce((acc, l) => {
      if (!acc[l.machine]) acc[l.machine] = { machine: l.machine, hours: 0, fuel: 0, breakdowns: 0, days: 0 };
      acc[l.machine].hours      += l.hours || 0;
      acc[l.machine].fuel       += l.fuel_liters || 0;
      acc[l.machine].breakdowns += l.status === 'avería' ? 1 : 0;
      acc[l.machine].days++;
      return acc;
    }, {})
  );

  // IA: flag machines with breakdown rate > 20%
  const alerts = by_machine
    .filter(m => m.days > 0 && (m.breakdowns / m.days) > 0.2)
    .map(m => ({ machine: m.machine, breakdown_rate: Math.round((m.breakdowns / m.days) * 100), recommendation: 'Revisar mantenimiento preventivo' }));

  res.json({ total_hours, total_fuel, breakdowns, by_machine, alerts });
});

router.post('/', (req, res) => {
  const id = db.nextId('machinery_logs');
  db.get('machinery_logs').push({ id, ...req.body }).write();
  res.json({ id });
});

router.put('/:id', (req, res) => {
  db.get('machinery_logs').find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.get('machinery_logs').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

module.exports = router;
