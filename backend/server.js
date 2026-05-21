const express      = require('express');
const cors         = require('cors');
const path         = require('path');
const fs           = require('fs');
const cookieParser = require('cookie-parser');
const app          = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const PASSWORD   = process.env.APP_PASSWORD || 'jcgarrido2026';
const AUTH_VALUE = 'tm_ok';

const LOGIN_PAGE = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Acceso — Soterramiento A5</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0f172a;min-height:100vh;display:flex;align-items:center;justify-content:center}
    .card{background:#fff;border-radius:16px;padding:40px;width:100%;max-width:380px;box-shadow:0 25px 50px rgba(0,0,0,.5)}
    .logo{text-align:center;margin-bottom:28px}
    .logo span{font-size:48px}
    .logo h1{font-size:20px;font-weight:700;color:#0f172a;margin-top:8px}
    .logo p{font-size:13px;color:#64748b;margin-top:4px}
    label{display:block;font-size:13px;font-weight:600;color:#374151;margin-bottom:6px}
    input{width:100%;padding:10px 14px;border:1.5px solid #e2e8f0;border-radius:8px;font-size:14px;outline:none;transition:border-color .2s}
    input:focus{border-color:#3b82f6}
    button{width:100%;padding:11px;background:#3b82f6;color:#fff;border:none;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;margin-top:16px;transition:background .2s}
    button:hover{background:#2563eb}
    .error{background:#fef2f2;border:1px solid #fecaca;color:#dc2626;border-radius:8px;padding:10px 14px;font-size:13px;margin-bottom:16px}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">
      <span>🚇</span>
      <h1>Soterramiento A5</h1>
      <p>Acceso restringido</p>
    </div>
    {{ERROR}}
    <form method="POST" action="/login">
      <label for="pwd">Contraseña</label>
      <input id="pwd" type="password" name="password" placeholder="Introduce la contraseña" autofocus required/>
      <button type="submit">Entrar</button>
    </form>
  </div>
</body>
</html>`;

// Login routes — before auth middleware
app.get('/login', (req, res) => {
  const error = req.query.error
    ? '<div class="error">Contraseña incorrecta. Inténtalo de nuevo.</div>'
    : '';
  res.send(LOGIN_PAGE.replace('{{ERROR}}', error));
});

app.post('/login', (req, res) => {
  if (req.body.password === PASSWORD) {
    res.cookie('tm_auth', AUTH_VALUE, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.redirect('/');
  } else {
    res.redirect('/login?error=1');
  }
});

// Auth middleware — protects everything below
app.use((req, res, next) => {
  if (req.cookies.tm_auth === AUTH_VALUE) return next();
  res.redirect('/login');
});

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

// Serve built frontend
const distPath = path.join(__dirname, '..', 'frontend', 'dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => res.sendFile(path.join(distPath, 'index.html')));
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
