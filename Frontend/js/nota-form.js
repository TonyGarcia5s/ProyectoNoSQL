const API_URL = "http://localhost:5000/api/notas";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formNota = document.getElementById("formNota");
const mongoIdInput = document.getElementById("mongoId");
const idNotaInput = document.getElementById("IdNota");
const idEstudianteInput = document.getElementById("IdEstudiante");
const idCursoInput = document.getElementById("IdCurso");
const periodoInput = document.getElementById("Periodo");
const notaInput = document.getElementById("Nota");
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

async function cargarNota() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar nota";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos de la nota...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const nota = await response.json();

    if (!response.ok) {
      throw new Error(nota.error || "No se pudo cargar la nota");
    }

    mongoIdInput.value = nota._id ?? "";
    idNotaInput.value = nota.IdNota ?? "";
    idEstudianteInput.value = nota.IdEstudiante ?? "";
    idCursoInput.value = nota.IdCurso ?? "";
    periodoInput.value = nota.Periodo ?? "";
    notaInput.value = nota.Nota ?? "";
    estadoInput.value = nota.Estado ?? "Registrada";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar la nota.";
    console.error(error);
    mostrarMensaje(error.message || "Error al cargar nota.", "error");
  }
}

async function guardarNota(e) {
  e.preventDefault();

  const payload = {
    IdNota: Number(idNotaInput.value),
    IdEstudiante: Number(idEstudianteInput.value),
    IdCurso: Number(idCursoInput.value),
    Periodo: Number(periodoInput.value),
    Nota: Number(notaInput.value),
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
      ? "Nota actualizada correctamente."
      : "Nota creada correctamente.";

    mostrarMensaje(
      idMongo ? "Nota actualizada correctamente." : "Nota creada correctamente.",
      idMongo ? "info" : "success"
    );

    setTimeout(() => {
      window.location.href = "notas.html";
    }, 900);
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar la nota.";
    console.error(error);
    mostrarMensaje(error.message || "Error al guardar nota.", "error");
  }
}

formNota.addEventListener("submit", guardarNota);

cargarNota();