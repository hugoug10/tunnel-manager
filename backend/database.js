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

const FULL_CATALOG = [
  // EXCAVACIÓN (act 1)
  { id: 1,  activity_id: 1, name: 'Gasóleo B maquinaria',              unit: 'l',   price: 1.45,  supplier: 'Repsol',         category: 'excavación'     },
  { id: 2,  activity_id: 1, name: 'ANFO explosivo perforación',         unit: 'kg',  price: 2.80,  supplier: 'Maxam',          category: 'excavación'     },
  { id: 3,  activity_id: 1, name: 'Zahorra natural árido',              unit: 't',   price: 8.50,  supplier: 'Lafarge',        category: 'excavación'     },
  { id: 4,  activity_id: 1, name: 'Horas excavadora hidráulica',        unit: 'h',   price: 95.00, supplier: 'Alquiler CAT',   category: 'maquinaria'     },
  { id: 5,  activity_id: 1, name: 'Horas volquete 16 t',               unit: 'h',   price: 52.00, supplier: 'Alquiler CAT',   category: 'maquinaria'     },
  // GUNITADO (act 2)
  { id: 6,  activity_id: 2, name: 'Hormigón proyectado H-25 e=10cm',   unit: 'm³',  price: 95.00, supplier: 'Holcim',         category: 'gunitado'       },
  { id: 7,  activity_id: 2, name: 'Fibras metálicas Dramix 3D',        unit: 'kg',  price: 1.85,  supplier: 'Bekaert',        category: 'gunitado'       },
  { id: 8,  activity_id: 2, name: 'Aditivo acelerante Sika Sigunit',   unit: 'l',   price: 3.20,  supplier: 'Sika',           category: 'gunitado'       },
  { id: 9,  activity_id: 2, name: 'Malla electrosoldada ME 15x15',     unit: 'm²',  price: 3.10,  supplier: 'Trefilerías',    category: 'gunitado'       },
  { id: 10, activity_id: 2, name: 'Bulón de anclaje L=3m',             unit: 'ud',  price: 18.50, supplier: 'Minova',         category: 'gunitado'       },
  // DRENAJE (act 3)
  { id: 11, activity_id: 3, name: 'Tubería drenante PVC ø315',         unit: 'ml',  price: 19.50, supplier: 'Uralita',        category: 'drenaje'        },
  { id: 12, activity_id: 3, name: 'Geotextil no tejido 200 g/m²',      unit: 'm²',  price: 2.80,  supplier: 'Propex',         category: 'drenaje'        },
  { id: 13, activity_id: 3, name: 'Grava filtrante 20/40mm',           unit: 't',   price: 18.00, supplier: 'Lafarge',        category: 'drenaje'        },
  { id: 14, activity_id: 3, name: 'Tubería HDPE ø200 colector',        unit: 'ml',  price: 38.00, supplier: 'Georg Fischer',  category: 'drenaje'        },
  // LOSA (act 4)
  { id: 15, activity_id: 4, name: 'Hormigón HA-30/B/20/IIa',          unit: 'm³',  price: 87.50, supplier: 'Holcim',         category: 'hormigón'       },
  { id: 16, activity_id: 4, name: 'Ferralla B500S',                    unit: 'kg',  price: 0.98,  supplier: 'ArcelorMittal',  category: 'acero'          },
  { id: 17, activity_id: 4, name: 'Aislamiento XPS 60mm',              unit: 'm²',  price: 12.50, supplier: 'Knauf',          category: 'aislamiento'    },
  { id: 18, activity_id: 4, name: 'Tubería geotermia HDPE ø32',        unit: 'ml',  price: 8.50,  supplier: 'Rehau',          category: 'geotermia'      },
  { id: 19, activity_id: 4, name: 'Panel encofrado fenólico',          unit: 'm²',  price: 5.80,  supplier: 'Ulma',           category: 'encofrado'      },
  // MURO FORRO (act 5)
  { id: 20, activity_id: 5, name: 'Hormigón HA-30 muro',              unit: 'm³',  price: 87.50, supplier: 'Holcim',         category: 'hormigón'       },
  { id: 21, activity_id: 5, name: 'Ferralla B500S muro',              unit: 'kg',  price: 0.98,  supplier: 'ArcelorMittal',  category: 'acero'          },
  { id: 22, activity_id: 5, name: 'Encofrado trepante modular',       unit: 'm²',  price: 8.20,  supplier: 'Peri',           category: 'encofrado'      },
  { id: 23, activity_id: 5, name: 'Aditivo impermeabilizante',        unit: 'kg',  price: 2.10,  supplier: 'Sika',           category: 'hormigón'       },
  // ESTRUCTURA VITREX (act 6)
  { id: 24, activity_id: 6, name: 'Perfil acero HEB 200',             unit: 'kg',  price: 1.45,  supplier: 'Celsa',          category: 'acero'          },
  { id: 25, activity_id: 6, name: 'Tornillería alta resistencia M20', unit: 'ud',  price: 0.85,  supplier: 'Würth',          category: 'acero'          },
  { id: 26, activity_id: 6, name: 'Pintura anticorrosión epoxi',      unit: 'l',   price: 8.50,  supplier: 'Jotun',          category: 'revestimiento'  },
  { id: 27, activity_id: 6, name: 'Anclaje químico Hilti',            unit: 'ud',  price: 12.00, supplier: 'Hilti',          category: 'acero'          },
  // BORDILLO Y ACERA (act 7)
  { id: 28, activity_id: 7, name: 'Bordillo prefabricado 10x20x100',  unit: 'ml',  price: 13.20, supplier: 'Precon',         category: 'urbanización'   },
  { id: 29, activity_id: 7, name: 'Hormigón HM-20 solera',            unit: 'm³',  price: 72.00, supplier: 'Holcim',         category: 'hormigón'       },
  { id: 30, activity_id: 7, name: 'Baldosa hidráulica 40x40cm',       unit: 'm²',  price: 18.50, supplier: 'Porcelanosa',    category: 'urbanización'   },
  { id: 31, activity_id: 7, name: 'Zahorra artificial ZA-20 sub-base',unit: 't',   price: 23.50, supplier: 'Lafarge',        category: 'áridos'         },
  // CANALIZACIONES TELEC (act 8)
  { id: 32, activity_id: 8, name: 'Prisma telecomunicaciones 4 tubos',unit: 'ml',  price: 45.00, supplier: 'Emtelle',        category: 'telecomunicaciones' },
  { id: 33, activity_id: 8, name: 'Tubería corrugada PVC ø110',       unit: 'ml',  price: 3.80,  supplier: 'Uralita',        category: 'telecomunicaciones' },
  { id: 34, activity_id: 8, name: 'Cableado fibra óptica 12FO',       unit: 'ml',  price: 4.50,  supplier: 'Prysmian',       category: 'telecomunicaciones' },
  { id: 35, activity_id: 8, name: 'Arqueta telecomunicaciones 60x60', unit: 'ud',  price: 95.00, supplier: 'Emtelle',        category: 'telecomunicaciones' },
  // RED ELÉCTRICA (act 9)
  { id: 36, activity_id: 9, name: 'Poste metálico galvanizado 9m',    unit: 'ud',  price: 450.00,supplier: 'Valmont',        category: 'eléctrico'      },
  { id: 37, activity_id: 9, name: 'Cable MT 15kV RHZ1-OL 240mm²',    unit: 'ml',  price: 28.50, supplier: 'General Cable',  category: 'eléctrico'      },
  { id: 38, activity_id: 9, name: 'Cable BT RV 0.6/1kV 4x16mm²',     unit: 'ml',  price: 9.20,  supplier: 'Prysmian',       category: 'eléctrico'      },
  { id: 39, activity_id: 9, name: 'Armario protección CGP-9',         unit: 'ud',  price: 1850.00,supplier: 'Schneider',     category: 'eléctrico'      },
  { id: 40, activity_id: 9, name: 'Cimentación poste HM-20',          unit: 'm³',  price: 72.00, supplier: 'Holcim',         category: 'hormigón'       },
];

const INITIAL_SUPPLIERS = [
  { id: 1, name: 'Holcim España',      contact: 'comercial@holcim.es',      phone: '900 123 456', category: 'hormigón'          },
  { id: 2, name: 'ArcelorMittal',      contact: 'ventas@arcelormittal.es',  phone: '91 234 5678', category: 'acero'             },
  { id: 3, name: 'Sika España',        contact: 'info@sika.es',             phone: '93 290 2390', category: 'química'           },
  { id: 4, name: 'Uralita',            contact: 'pedidos@uralita.com',      phone: '91 567 8901', category: 'drenaje'           },
  { id: 5, name: 'Lafarge Tarmac',     contact: 'ventas@lafarge.es',        phone: '91 890 1234', category: 'áridos'            },
  { id: 6, name: 'Maxam',             contact: 'industrial@maxam.com',     phone: '91 456 7890', category: 'explosivos'         },
  { id: 7, name: 'Prysmian Group',     contact: 'ventas.es@prysmian.com',   phone: '93 312 4500', category: 'cableado'          },
  { id: 8, name: 'Schneider Electric', contact: 'info.spain@schneider.com', phone: '91 749 9000', category: 'eléctrico'         },
];

const INITIAL_BUDGET_ITEMS = [
  // Excavación (act 1) — 265m de túnel, sección ~16m²
  { id: 1,  activity_id: 1, description: 'Gasóleo maquinaria excavación',      unit: 'l',   qty_planned: 18000, qty_real: 11200, unit_price: 1.45,  material_id: 1  },
  { id: 2,  activity_id: 1, description: 'ANFO perforación y voladura',        unit: 'kg',  qty_planned: 4200,  qty_real: 2600,  unit_price: 2.80,  material_id: 2  },
  { id: 3,  activity_id: 1, description: 'Zahorra nivelación fondo',           unit: 't',   qty_planned: 320,   qty_real: 195,   unit_price: 8.50,  material_id: 3  },
  { id: 4,  activity_id: 1, description: 'Horas excavadora hidráulica',        unit: 'h',   qty_planned: 425,   qty_real: 278,   unit_price: 95.00, material_id: 4  },
  // Gunitado (act 2) — 3900 m²
  { id: 5,  activity_id: 2, description: 'Hormigón proyectado H-25',          unit: 'm³',  qty_planned: 390,   qty_real: 135,   unit_price: 95.00, material_id: 6  },
  { id: 6,  activity_id: 2, description: 'Fibras metálicas Dramix 3D',        unit: 'kg',  qty_planned: 15600, qty_real: 6100,  unit_price: 1.85,  material_id: 7  },
  { id: 7,  activity_id: 2, description: 'Aditivo acelerante Sika',           unit: 'l',   qty_planned: 1950,  qty_real: 820,   unit_price: 3.20,  material_id: 8  },
  { id: 8,  activity_id: 2, description: 'Malla electrosoldada ME15x15',      unit: 'm²',  qty_planned: 3900,  qty_real: 1390,  unit_price: 3.10,  material_id: 9  },
  { id: 9,  activity_id: 2, description: 'Bulones de anclaje L=3m',           unit: 'ud',  qty_planned: 520,   qty_real: 185,   unit_price: 18.50, material_id: 10 },
  // Drenaje (act 3)
  { id: 10, activity_id: 3, description: 'Tubería drenante PVC ø315',         unit: 'ml',  qty_planned: 265,   qty_real: 0,     unit_price: 19.50, material_id: 11 },
  { id: 11, activity_id: 3, description: 'Geotextil no tejido',               unit: 'm²',  qty_planned: 530,   qty_real: 0,     unit_price: 2.80,  material_id: 12 },
  { id: 12, activity_id: 3, description: 'Grava filtrante 20/40mm',           unit: 't',   qty_planned: 185,   qty_real: 0,     unit_price: 18.00, material_id: 13 },
  // Losa inferior (act 4)
  { id: 13, activity_id: 4, description: 'Hormigón HA-30 losa',              unit: 'm³',  qty_planned: 520,   qty_real: 0,     unit_price: 87.50, material_id: 15 },
  { id: 14, activity_id: 4, description: 'Ferralla B500S losa',              unit: 'kg',  qty_planned: 62400, qty_real: 0,     unit_price: 0.98,  material_id: 16 },
  { id: 15, activity_id: 4, description: 'Aislamiento XPS 60mm',             unit: 'm²',  qty_planned: 1060,  qty_real: 0,     unit_price: 12.50, material_id: 17 },
  { id: 16, activity_id: 4, description: 'Tubería geotermia HDPE ø32',       unit: 'ml',  qty_planned: 3800,  qty_real: 0,     unit_price: 8.50,  material_id: 18 },
  // Muro forro (act 5)
  { id: 17, activity_id: 5, description: 'Hormigón HA-30 muro',              unit: 'm³',  qty_planned: 310,   qty_real: 0,     unit_price: 87.50, material_id: 20 },
  { id: 18, activity_id: 5, description: 'Ferralla B500S muro',              unit: 'kg',  qty_planned: 46500, qty_real: 0,     unit_price: 0.98,  material_id: 21 },
  { id: 19, activity_id: 5, description: 'Encofrado trepante modular',       unit: 'm²',  qty_planned: 620,   qty_real: 0,     unit_price: 8.20,  material_id: 22 },
  // Estructura Vitrex (act 6)
  { id: 20, activity_id: 6, description: 'Perfil acero HEB 200',             unit: 'kg',  qty_planned: 28500, qty_real: 0,     unit_price: 1.45,  material_id: 24 },
  { id: 21, activity_id: 6, description: 'Tornillería alta resistencia M20', unit: 'ud',  qty_planned: 2400,  qty_real: 0,     unit_price: 0.85,  material_id: 25 },
  // Bordillo y acera (act 7)
  { id: 22, activity_id: 7, description: 'Bordillo prefabricado 10x20x100',  unit: 'ml',  qty_planned: 530,   qty_real: 0,     unit_price: 13.20, material_id: 28 },
  { id: 23, activity_id: 7, description: 'Hormigón HM-20 solera acera',      unit: 'm³',  qty_planned: 95,    qty_real: 0,     unit_price: 72.00, material_id: 29 },
  { id: 24, activity_id: 7, description: 'Baldosa hidráulica 40x40',         unit: 'm²',  qty_planned: 850,   qty_real: 0,     unit_price: 18.50, material_id: 30 },
  // Canalizaciones (act 8)
  { id: 25, activity_id: 8, description: 'Prisma telecomunicaciones 4 tubos',unit: 'ml',  qty_planned: 265,   qty_real: 0,     unit_price: 45.00, material_id: 32 },
  { id: 26, activity_id: 8, description: 'Tubería corrugada PVC ø110',       unit: 'ml',  qty_planned: 1060,  qty_real: 0,     unit_price: 3.80,  material_id: 33 },
  // Red eléctrica (act 9)
  { id: 27, activity_id: 9, description: 'Cable MT 15kV',                    unit: 'ml',  qty_planned: 320,   qty_real: 64,    unit_price: 28.50, material_id: 37 },
  { id: 28, activity_id: 9, description: 'Postes metálicos galvanizados 9m', unit: 'ud',  qty_planned: 8,     qty_real: 2,     unit_price: 450.00,material_id: 36 },
  { id: 29, activity_id: 9, description: 'Armarios protección CGP-9',        unit: 'ud',  qty_planned: 2,     qty_real: 0,     unit_price: 1850.00,material_id: 39},
];

const INITIAL_PRICE_HISTORY = [
  { id: 1, material_id: 15, price: 82.00,  date: '2025-01-01', note: 'Precio inicial' },
  { id: 2, material_id: 15, price: 85.00,  date: '2025-02-01', note: 'Subida materias primas' },
  { id: 3, material_id: 15, price: 87.50,  date: '2025-03-01', note: 'Actualización trimestral' },
  { id: 4, material_id: 16, price: 0.92,   date: '2025-01-01', note: 'Precio inicial' },
  { id: 5, material_id: 16, price: 0.95,   date: '2025-02-15', note: 'Incremento acero' },
  { id: 6, material_id: 16, price: 0.98,   date: '2025-03-01', note: 'Mercado alcista' },
  { id: 7, material_id: 6,  price: 88.00,  date: '2025-01-01', note: 'Precio inicial' },
  { id: 8, material_id: 6,  price: 95.00,  date: '2025-02-15', note: 'Revisión contrato Sika' },
];

// ── NUEVOS MÓDULOS ────────────────────────────────────────────────────────────

const INITIAL_QUALITY_TESTS = [
  { id: 1, activity_id: 1, type: 'Compactación Proctor', date: '2026-04-08', pk: '1+900', result: 98.2, min_value: 95, unit: '%',      status: 'ok',  technician: 'Luis M.',   observations: '' },
  { id: 2, activity_id: 1, type: 'Granulometría zahorra', date: '2026-04-10', pk: '1+850', result: 100, min_value: 100, unit: 'conforme', status: 'ok',  technician: 'Luis M.',   observations: 'Curva dentro de huso' },
  { id: 3, activity_id: 2, type: 'Rotura probeta gunita 7d', date: '2026-04-14', pk: '1+880', result: 22.4, min_value: 25, unit: 'N/mm²', status: 'nok', technician: 'Ana P.',    observations: 'No cumple resistencia mínima. Revisión dosificación' },
  { id: 4, activity_id: 2, type: 'Rotura probeta gunita 28d', date: '2026-04-20', pk: '1+880', result: 31.8, min_value: 25, unit: 'N/mm²', status: 'ok', technician: 'Ana P.',   observations: 'Resistencia final correcta' },
  { id: 5, activity_id: 2, type: 'Espesor gunitado', date: '2026-04-18', pk: '1+860', result: 11.2, min_value: 10, unit: 'cm',      status: 'ok',  technician: 'Ana P.',    observations: '' },
  { id: 6, activity_id: 1, type: 'Rotura probeta HA-30 7d',  date: '2026-04-22', pk: '1+810', result: 28.5, min_value: 25, unit: 'N/mm²', status: 'ok', technician: 'Luis M.',  observations: '' },
  { id: 7, activity_id: 1, type: 'Rotura probeta HA-30 28d', date: '2026-05-06', pk: '1+810', result: 34.2, min_value: 30, unit: 'N/mm²', status: 'ok', technician: 'Luis M.',  observations: '' },
  { id: 8, activity_id: 9, type: 'Hincado puesta tierra',     date: '2026-04-12', pk: '1+770', result: 3.2,  min_value: 5,  unit: 'Ω',    status: 'nok', technician: 'Carlos R.', observations: 'Resistividad elevada. Ampliar red de tierra' },
];

const INITIAL_MACHINERY = [
  { id: 1, date: '2026-04-01', machine: 'Excavadora CAT 336', plate: 'CAT-336-01', operator: 'Miguel A.', hours: 8.5, fuel_liters: 98,  activity_id: 1, status: 'ok',       observations: '' },
  { id: 2, date: '2026-04-01', machine: 'Volquete Volvo A40', plate: 'VO-40-01',   operator: 'Pedro S.',  hours: 9.0, fuel_liters: 125, activity_id: 1, status: 'ok',       observations: '' },
  { id: 3, date: '2026-04-02', machine: 'Excavadora CAT 336', plate: 'CAT-336-01', operator: 'Miguel A.', hours: 7.0, fuel_liters: 82,  activity_id: 1, status: 'avería',   observations: 'Fallo hidráulico brazo. Parada 2h para reparación' },
  { id: 4, date: '2026-04-03', machine: 'Excavadora CAT 336', plate: 'CAT-336-01', operator: 'Miguel A.', hours: 8.5, fuel_liters: 96,  activity_id: 1, status: 'ok',       observations: '' },
  { id: 5, date: '2026-04-10', machine: 'Bomba gunita Putzmeister', plate: 'PUT-01', operator: 'Raúl G.',  hours: 7.5, fuel_liters: 45,  activity_id: 2, status: 'ok',       observations: '' },
  { id: 6, date: '2026-04-11', machine: 'Bomba gunita Putzmeister', plate: 'PUT-01', operator: 'Raúl G.',  hours: 8.0, fuel_liters: 48,  activity_id: 2, status: 'ok',       observations: '' },
  { id: 7, date: '2026-04-12', machine: 'Bomba gunita Putzmeister', plate: 'PUT-01', operator: 'Raúl G.',  hours: 5.0, fuel_liters: 30,  activity_id: 2, status: 'avería',   observations: 'Obstrucción en línea. Limpieza y reinicio' },
  { id: 8, date: '2026-04-05', machine: 'Camión grúa 30T',   plate: 'GRU-30-01',  operator: 'Javier M.', hours: 4.0, fuel_liters: 60,  activity_id: 9, status: 'ok',       observations: '' },
  { id: 9, date: '2026-04-15', machine: 'Excavadora CAT 336', plate: 'CAT-336-01', operator: 'Miguel A.', hours: 8.0, fuel_liters: 91,  activity_id: 1, status: 'ok',       observations: '' },
  { id:10, date: '2026-04-16', machine: 'Volquete Volvo A40', plate: 'VO-40-01',   operator: 'Pedro S.',  hours: 9.5, fuel_liters: 132, activity_id: 1, status: 'ok',       observations: '' },
];

const INITIAL_SAFETY = [
  { id: 1, date: '2026-04-03', type: 'casi-accidente', severity: 'medium', location: 'PK 1+900 Frente excavación', description: 'Caída de bloque suelto desde hastial durante excavación. Operario en zona sin casco.', injured: false, corrective: 'Refuerzo de señalización. Charla de seguridad a toda la plantilla. Revisión diaria de hastiales.', status: 'cerrada' },
  { id: 2, date: '2026-04-07', type: 'inspección',    severity: 'low',    location: 'Toda la obra',               description: 'Inspección rutinaria del coordinador de seguridad. 3 no conformidades menores detectadas.', injured: false, corrective: 'Corrección de señalización, orden y limpieza en zona de acopio.', status: 'cerrada' },
  { id: 3, date: '2026-04-15', type: 'casi-accidente', severity: 'high',  location: 'PK 1+870 Zona gunitado',     description: 'Proyección de hormigón sobre operario sin gafas de protección. Sin lesión por reacción rápida.', injured: false, corrective: 'Obligatorio uso de gafas en zona de proyección. Revisión EPIs de todo el personal.', status: 'cerrada' },
  { id: 4, date: '2026-04-20', type: 'inspección',    severity: 'low',    location: 'Instalaciones eléctricas',   description: 'Revisión cuadros eléctricos provisionales. Todo conforme.', injured: false, corrective: 'Sin acciones requeridas.', status: 'cerrada' },
  { id: 5, date: '2026-05-02', type: 'accidente',     severity: 'medium', location: 'PK 1+820 Zona ferralla',     description: 'Corte en mano derecha durante manipulación de ferralla sin guantes adecuados. Herida leve, curada en botiquín.', injured: true, corrective: 'Revisión obligatoria guantes de corte nivel 4. Parte de accidente presentado.', status: 'abierta' },
];

const INITIAL_DOCS = [
  { id: 1, name: 'Plano Planta General PK 1+675 a 1+940', type: 'plano', category: 'topografía', activity_id: null, date: '2026-03-15', size: '2.4 MB', format: 'PDF', uploaded_by: 'Jefe de obra', path: null },
  { id: 2, name: 'Plano Sección Transversal Tipo Túnel',   type: 'plano', category: 'estructura',  activity_id: 1,    date: '2026-03-15', size: '1.8 MB', format: 'PDF', uploaded_by: 'Jefe de obra', path: null },
  { id: 3, name: 'Plano Armado Losa Inferior',             type: 'plano', category: 'estructura',  activity_id: 4,    date: '2026-03-20', size: '3.1 MB', format: 'PDF', uploaded_by: 'Jefe de obra', path: null },
  { id: 4, name: 'Plano Drenaje Longitudinal',             type: 'plano', category: 'drenaje',     activity_id: 3,    date: '2026-03-18', size: '1.2 MB', format: 'PDF', uploaded_by: 'Jefe de obra', path: null },
  { id: 5, name: 'Plan de Seguridad y Salud',              type: 'documento', category: 'seguridad', activity_id: null, date: '2026-02-28', size: '4.5 MB', format: 'PDF', uploaded_by: 'Coordinador SS', path: null },
  { id: 6, name: 'Control de Calidad — Hormigones',        type: 'documento', category: 'calidad',   activity_id: null, date: '2026-03-01', size: '0.8 MB', format: 'PDF', uploaded_by: 'Lab. externo', path: null },
  { id: 7, name: 'Proyecto Eléctrico Reposición 1+770',    type: 'plano', category: 'instalaciones', activity_id: 9,   date: '2026-03-25', size: '2.0 MB', format: 'PDF', uploaded_by: 'Jefe de obra', path: null },
];

// ── Seed only on first run (version check = zero writes on subsequent starts) ─
const SEED_VERSION = 2;
if (db.get('_seedVersion').value() !== SEED_VERSION) {
  db.set('activities',              INITIAL_ACTIVITIES)
    .set('materials',               [])
    .set('daily_reports',           [])
    .set('weekly_reports',          [])
    .set('users',                   [])
    .set('catalog',                 FULL_CATALOG)
    .set('suppliers',               INITIAL_SUPPLIERS)
    .set('budget_items',            INITIAL_BUDGET_ITEMS)
    .set('material_prices_history', INITIAL_PRICE_HISTORY)
    .set('quality_tests',           INITIAL_QUALITY_TESTS)
    .set('machinery_logs',          INITIAL_MACHINERY)
    .set('safety_incidents',        INITIAL_SAFETY)
    .set('documents',               INITIAL_DOCS)
    .set('_nextId', {
      activities: 10, materials: 1, daily_reports: 1, weekly_reports: 1,
      catalog: 41, suppliers: 9, budget_items: 30, price_history: 9,
      quality_tests: 9, machinery_logs: 11, safety_incidents: 6, documents: 8
    })
    .set('_seedVersion', SEED_VERSION)
    .write(); // ONE write — only on first start
}

db.nextId = function(collection) {
  const current = db.get(`_nextId.${collection}`).value();
  db.set(`_nextId.${collection}`, current + 1).write();
  return current;
};

module.exports = db;
