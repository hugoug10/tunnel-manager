const express = require('express');
const router  = express.Router();
const db      = require('../database');

router.get('/', (req, res) => {
  res.json(db.get('safety_incidents').sortBy('date').reverse().value());
});

router.get('/stats', (req, res) => {
  const inc = db.get('safety_incidents').value();
  const accidentes    = inc.filter(i => i.type === 'accidente').length;
  const casi          = inc.filter(i => i.type === 'casi-accidente').length;
  const inspecciones  = inc.filter(i => i.type === 'inspección').length;
  const high_severity = inc.filter(i => i.severity === 'high').length;
  const open          = inc.filter(i => i.status === 'abierta').length;
  const injured       = inc.filter(i => i.injured).length;

  // IA pattern analysis
  const locations = inc.map(i => i.location);
  const ai_insights = [];
  if (casi > 1) ai_insights.push({ type: 'pattern', msg: `${casi} casi-accidentes registrados. Revisar medidas preventivas en frente de excavación.` });
  if (high_severity > 0) ai_insights.push({ type: 'alert', msg: `${high_severity} incidencia(s) de gravedad ALTA requieren análisis de causa raíz.` });
  if (open > 0) ai_insights.push({ type: 'pending', msg: `${open} acción correctiva pendiente de cierre.` });
  ai_insights.push({ type: 'kpi', msg: `Índice de frecuencia: ${injured > 0 ? 'CON lesionados' : 'SIN lesionados graves hasta la fecha'}.` });

  res.json({ total: inc.length, accidentes, casi, inspecciones, high_severity, open, injured, ai_insights });
});

router.post('/', (req, res) => {
  const id = db.nextId('safety_incidents');
  db.get('safety_incidents').push({ id, ...req.body, status: req.body.status || 'abierta' }).write();
  res.json({ id });
});

router.put('/:id', (req, res) => {
  db.get('safety_incidents').find({ id: parseInt(req.params.id) }).assign(req.body).write();
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.get('safety_incidents').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

module.exports = router;
