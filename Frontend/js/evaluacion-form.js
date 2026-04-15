const API_URL = "http://localhost:5000/api/evaluaciones";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formEvaluacion = document.getElementById("formEvaluacion");
const mongoIdInput = document.getElementById("mongoId");
const idEvaluacionInput = document.getElementById("IdEvaluacion");
const idCursoInput = document.getElementById("IdCurso");
const nombreInput = document.getElementById("Nombre");
const porcentajeInput = document.getElementById("Porcentaje");
const fechaInput = document.getElementById("Fecha");
const estadoInput = document.getElementById("Estado");

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

async function cargarEvaluacion() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar evaluación";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos de la evaluación...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const item = await response.json();

    if (!response.ok) {
      throw new Error(item.error || "No se pudo cargar la evaluación");
    }

    mongoIdInput.value = item._id ?? "";
    idEvaluacionInput.value = item.IdEvaluacion ?? "";
    idCursoInput.value = item.IdCurso ?? "";
    nombreInput.value = item.Nombre ?? "";
    porcentajeInput.value = item.Porcentaje ?? "";
    fechaInput.value = formatearFecha(item.Fecha);
    estadoInput.value = item.Estado ?? "Pendiente";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar la evaluación.";
    console.error(error);
    mostrarMensaje(error.message || "Error al cargar evaluación.", "error");
  }
}

async function guardarEvaluacion(e) {
  e.preventDefault();

  const payload = {
    IdEvaluacion: Number(idEvaluacionInput.value),
    IdCurso: Number(idCursoInput.value),
    Nombre: nombreInput.value.trim(),
    Porcentaje: Number(porcentajeInput.value),
    Fecha: fechaInput.value,
    Estado: estadoInput.value,
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
      ? "Evaluación actualizada correctamente."
      : "Evaluación creada correctamente.";

    mostrarMensaje(
      idMongo ? "Evaluación actualizada correctamente." : "Evaluación creada correctamente.",
      idMongo ? "info" : "success"
    );

    setTimeout(() => {
      window.location.href = "evaluaciones.html";
    }, 900);
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar la evaluación.";
    console.error(error);
    mostrarMensaje(error.message || "Error al guardar evaluación.", "error");
  }
}

formEvaluacion.addEventListener("submit", guardarEvaluacion);

cargarEvaluacion();