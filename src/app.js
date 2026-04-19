const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

// Conectar a Mongo
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta a la carpeta Frontend
const frontendPath = path.join(__dirname, "..", "Frontend");

// Servir archivos estáticos del frontend
app.use(express.static(frontendPath));

// ========= RUTAS API =========
app.use("/api/asistencias", require("./routes/asistencia.routes"));
app.use("/api/aulas", require("./routes/aula.routes"));
app.use("/api/comunicados", require("./routes/comunicado.routes"));
app.use("/api/cursos", require("./routes/curso.routes"));
app.use("/api/docentes", require("./routes/docente.routes"));
app.use("/api/estudiantes", require("./routes/estudiante.routes"));
app.use("/api/evaluaciones", require("./routes/evaluacion.routes"));
app.use("/api/grupos", require("./routes/grupo.routes"));
app.use("/api/horarios", require("./routes/horario.routes"));
app.use("/api/inventarios", require("./routes/inventario.routes"));
app.use("/api/materias", require("./routes/materia.routes"));
app.use("/api/matriculas", require("./routes/matricula.routes"));
app.use("/api/notas", require("./routes/nota.routes"));
app.use("/api/padres", require("./routes/padre.routes"));
app.use("/api/pagos", require("./routes/pago.routes"));
app.use("/api/auth", require("./routes/auth.routes"));

// Ruta de prueba API
app.get("/api", (req, res) => {
  res.json({
    ok: true,
    mensaje: "API funcionando correctamente"
  });
});

// Mostrar el frontend al entrar a localhost:5000
app.get("/", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

// Para cualquier otra ruta del frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});