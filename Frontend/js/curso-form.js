const API_URL = "http://localhost:5000/api/cursos";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formCurso = document.getElementById("formCurso");
const mongoIdInput = document.getElementById("mongoId");
const idCursoInput = document.getElementById("IdCurso");
const nombreInput = document.getElementById("Nombre");
const idMateriaInput = document.getElementById("IdMateria");
const idDocenteInput = document.getElementById("IdDocente");
const idGrupoInput = document.getElementById("IdGrupo");
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

async function cargarCurso() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar curso";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos del curso...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const item = await response.json();

    if (!response.ok) {
      throw new Error(item.error || "No se pudo cargar el curso");
    }

    mongoIdInput.value = item._id ?? "";
    idCursoInput.value = item.IdCurso ?? "";
    nombreInput.value = item.Nombre ?? "";
    idMateriaInput.value = item.IdMateria ?? "";
    idDocenteInput.value = item.IdDocente ?? "";
    idGrupoInput.value = item.IdGrupo ?? "";
    estadoInput.value = item.Estado ?? "Activo";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar el curso.";
    console.error(error);
    mostrarMensaje(error.message || "Error al cargar curso.", "error");
  }
}

async function guardarCurso(e) {
  e.preventDefault();

  const payload = {
    IdCurso: Number(idCursoInput.value),
    Nombre: nombreInput.value.trim(),
    IdMateria: Number(idMateriaInput.value),
    IdDocente: Number(idDocenteInput.value),
    IdGrupo: Number(idGrupoInput.value),
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
      ? "Curso actualizado correctamente."
      : "Curso creado correctamente.";

    mostrarMensaje(
      idMongo ? "Curso actualizado correctamente." : "Curso creado correctamente.",
      idMongo ? "info" : "success"
    );

    setTimeout(() => {
      window.location.href = "cursos.html";
    }, 900);
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar el curso.";
    console.error(error);
    mostrarMensaje(error.message || "Error al guardar curso.", "error");
  }
}

formCurso.addEventListener("submit", guardarCurso);

cargarCurso();