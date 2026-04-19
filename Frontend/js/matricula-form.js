const API_URL = "http://localhost:5000/api/matriculas";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formMatricula = document.getElementById("formMatricula");
const mongoIdInput = document.getElementById("mongoId");
const idMatriculaInput = document.getElementById("IdMatricula");
const idEstudianteInput = document.getElementById("IdEstudiante");
const periodoInput = document.getElementById("Periodo");
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

async function cargarMatricula() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar matrícula";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos de la matrícula...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const item = await response.json();

    if (!response.ok) {
      throw new Error(item.error || "No se pudo cargar la matrícula");
    }

    mongoIdInput.value = item._id ?? "";
    idMatriculaInput.value = item.IdMatricula ?? "";
    idEstudianteInput.value = item.IdEstudiante ?? "";
    periodoInput.value = item.Periodo ?? "";
    fechaInput.value = formatearFecha(item.Fecha);
    estadoInput.value = item.Estado ?? "Activa";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar la matrícula.";
    console.error(error);
    mostrarMensaje(error.message || "Error al cargar matrícula.", "error");
  }
}

async function guardarMatricula(e) {
  e.preventDefault();

  const payload = {
    IdMatricula: Number(idMatriculaInput.value),
    IdEstudiante: Number(idEstudianteInput.value),
    Periodo: periodoInput.value.trim(),
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
      ? "Matrícula actualizada correctamente."
      : "Matrícula creada correctamente.";

    mostrarMensaje(
      idMongo ? "Matrícula actualizada correctamente." : "Matrícula creada correctamente.",
      idMongo ? "info" : "success"
    );

    setTimeout(() => {
      window.location.href = "matriculas.html";
    }, 900);
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar la matrícula.";
    console.error(error);
    mostrarMensaje(error.message || "Error al guardar matrícula.", "error");
  }
}

formMatricula.addEventListener("submit", guardarMatricula);

cargarMatricula();