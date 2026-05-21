const express = require('express');
const cors    = require('cors');
const path    = require('path');
const fs      = require('fs');
const app     = express();

app.use(cors());
app.use(express.json());

app.use('/api/activities', require('./routes/activities'));
app.use('/api/reports',    require('./routes/reports'));
app.use('/api/materials',  require('./routes/materials'));
app.use('/api/budget',     require('./routes/budget'));
app.use('/api/planos',     require('./routes/planos'));
app.use('/api/calidad',    require('./routes/calidad'));
app.use('/api/maquinaria', require('./routes/maquinaria'));
app.use('/api/seguridad',  require('./routes/seguridad'));
app.use('/api/ia',         require('./routes/ia'));
app.use('/uploads',        express.static(path.join(__dirname, 'uploads')));

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Serve built frontend if dist folder exists
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
