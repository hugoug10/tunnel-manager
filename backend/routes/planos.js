const express = require('express');
const multer  = require('multer');
const path    = require('path');
const fs      = require('fs');
const router  = express.Router();
const db      = require('../database');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename:    (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});
const upload = multer({ storage, limits: { fileSize: 50 * 1024 * 1024 } });

router.get('/', (req, res) => {
  const { category, type } = req.query;
  let docs = db.get('documents');
  if (category) docs = docs.filter({ category });
  if (type)     docs = docs.filter({ type });
  res.json(docs.sortBy('date').reverse().value());
});

router.post('/upload', upload.single('file'), (req, res) => {
  const { name, type, category, activity_id } = req.body;
  const id = db.nextId('documents');
  const doc = {
    id, name: name || req.file.originalname, type: type || 'documento',
    category: category || 'general',
    activity_id: activity_id ? parseInt(activity_id) : null,
    date: new Date().toISOString().split('T')[0],
    size: req.file ? `${(req.file.size / 1024).toFixed(0)} KB` : '—',
    format: req.file ? path.extname(req.file.originalname).slice(1).toUpperCase() : '—',
    uploaded_by: 'Usuario', path: req.file ? req.file.filename : null,
  };
  db.get('documents').push(doc).write();
  res.json({ id });
});

router.delete('/:id', (req, res) => {
  const doc = db.get('documents').find({ id: parseInt(req.params.id) }).value();
  if (doc?.path) {
    const fp = path.join(__dirname, '../uploads', doc.path);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  db.get('documents').remove({ id: parseInt(req.params.id) }).write();
  res.json({ success: true });
});

router.get('/download/:id', (req, res) => {
  const doc = db.get('documents').find({ id: parseInt(req.params.id) }).value();
  if (!doc?.path) return res.status(404).json({ error: 'Archivo no disponible' });
  const fp = path.join(__dirname, '../uploads', doc.path);
  if (!fs.existsSync(fp)) return res.status(404).json({ error: 'Archivo no encontrado' });
  res.download(fp, doc.name);
});

module.exports = router;
