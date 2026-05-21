const express = require('express');
const router = express.Router();
const db = require('../database');

router.get('/', (req, res) => {
  const { activity_id } = req.query;
  let items = db.get('materials');
  if (activity_id) items = items.filter({ activity_id: parseInt(activity_id) });
  res.json(items.value());
});

router.post('/', (req, res) => {
  const id = db.nextId('materials');
  db.get('materials').push({ id, ...req.body }).write();
  res.json({ id });
});

router.put('/:id', (req, res) => {
  db.get('materials').find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.get('materials').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

module.exports = router;
