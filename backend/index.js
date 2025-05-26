const express = require('express');
const mysql = require('mysql2/promise'); // usamos la versión con promesas
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;


const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Crear pool de conexiones a MySQL
const pool = mysql.createPool({
  host: 'mysql',         // nombre del servicio en docker-compose
  user: 'leo',
  password: 'leo123',
  database: 'usuarios_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Ruta para registrar un nuevo usuario
app.post('/registro', async (req, res) => {
  const { dni, nombre, apellido, email, direccion, password } = req.body;

  // Validación básica
  if (!dni || !nombre || !apellido || !email || !direccion || !password) {
    return res.status(400).json({ mensaje: 'Faltan datos obligatorios' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const query = `
      INSERT INTO usuarios (dni, nombre, apellido, email, direccion, password)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
   // const [result] = await pool.query(query, [dni, nombre, apellido, email, direccion, password]);
    await pool.query(query, [dni, nombre, apellido, email, direccion, hashedPassword]);

    res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
  } catch (err) {
    console.error('❌ Error al registrar usuario:', err);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
});

// Ruta para iniciar sesión
app.post('/login', async (req, res) => {
  const { dni, password } = req.body;

  if (!dni || !password) {
    return res.status(400).json({ mensaje: 'DNI y contraseña son obligatorios' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE dni = ?', [dni]);

    if (rows.length === 0) {
      return res.status(401).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuario = rows[0];

    const coincide = await bcrypt.compare(password, usuario.password);

    if (!coincide) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    res.status(200).json({ mensaje: 'Login exitoso', usuario: { dni: usuario.dni, nombre: usuario.nombre, apellido: usuario.apellido } });
  } catch (error) {
    console.error('❌ Error en login:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
});


// Ruta para obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener usuarios:', err);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

app.post('/registro', async (req, res) => {
  const { nombre, apellido, dni, email, direccion, password } = req.body;

  if (!nombre || !apellido || !dni || !email || !direccion || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si ya existe un usuario con ese DNI
    const [existe] = await pool.query('SELECT dni FROM usuarios WHERE dni = ?', [dni]);
    if (existe.length > 0) {
      return res.status(409).json({ mensaje: 'El DNI ya está registrado' });
    }

    // Hashear la contraseña
    const hash = await bcrypt.hash(password, 10);

    // Insertar el nuevo usuario
    await pool.query(
      'INSERT INTO usuarios (nombre, apellido, dni, email, direccion, password) VALUES (?, ?, ?, ?, ?, ?)',
      [nombre, apellido, dni, email, direccion, hash]
    );

    res.status(201).json({ mensaje: 'Registro exitoso' });
  } catch (error) {
    console.error('❌ Error en registro:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
});


// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend escuchando en http://localhost:${PORT}`);
});
