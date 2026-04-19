const API_URL = "http://localhost:5000/api/asistencias";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formAsistencia = document.getElementById("formAsistencia");
const mongoIdInput = document.getElementById("mongoId");
const idAsistenciaInput = document.getElementById("IdAsistencia");
const idEstudianteInput = document.getElementById("IdEstudiante");
const fechaInput = document.getElementById("Fecha");
const estadoInput = document.getElementById("Estado");
const observacionInput = document.getElementById("Observacion");

const tituloFormulario = document.getElementById("tituloFormulario");
const modoFormulario = document.getElementById("modoFormulario");
const mensajeFormulario = document.getElementById("mensajeFormulario");

function mostrarMensaje(texto, tipo = "success") {
  const mensaje = document.createElement("div");
  mensaje.className = `toast-msg toast-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 2200);
}

function formatearFecha(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

async function cargarAsistencia() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar asistencia";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos de la asistencia...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const item = await response.json();

    if (!response.ok) {
      throw new Error(item.error || "No se pudo cargar la asistencia");
    }

    mongoIdInput.value = item._id ?? "";
    idAsistenciaInput.value = item.IdAsistencia ?? "";
    idEstudianteInput.value = item.IdEstudiante ?? "";
    fechaInput.value = formatearFecha(item.Fecha);
    estadoInput.value = item.Estado ?? "Presente";
    observacionInput.value = item.Observacion ?? "";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar la asistencia.";
    console.error(error);
    mostrarMensaje(error.message || "Error al cargar asistencia.", "error");
  }
}

async function guardarAsistencia(e) {
  e.preventDefault();

  const payload = {
    IdAsistencia: Number(idAsistenciaInput.value),
    IdEstudiante: Number(idEstudianteInput.value),
    Fecha: fechaInput.value,
    Estado: estadoInput.value,
    Observacion: observacionInput.value.trim(),
  };

  try {
    let response;

    if (idMongo) {
      response = await fetch(`${API_URL}/${idMongo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo guardar");
    }

    mensajeFormulario.textContent = idMongo
      ? "Asistencia actualizada correctamente."
      : "Asistencia creada correctamente.";

    mostrarMensaje(
      idMongo ? "Asistencia actualizada correctamente." : "Asistencia creada correctamente.",
      idMongo ? "info" : "success"
    );

    setTimeout(() => {
      window.location.href = "asistencia.html";
    }, 900);
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar la asistencia.";
    console.error(error);
    mostrarMensaje(error.message || "Error al guardar asistencia.", "error");
  }
}

formAsistencia.addEventListener("submit", guardarAsistencia);

cargarAsistencia();