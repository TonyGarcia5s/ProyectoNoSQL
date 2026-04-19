const API_URL = "http://localhost:5000/api/estudiantes";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formEstudiante = document.getElementById("formEstudiante");
const mongoIdInput = document.getElementById("mongoId");
const idEstudianteInput = document.getElementById("IdEstudiante");
const nombreInput = document.getElementById("Nombre");
const fechaNacimientoInput = document.getElementById("FechaNacimiento");
const generoInput = document.getElementById("Genero");
const idGrupoInput = document.getElementById("IdGrupo");
const estadoInput = document.getElementById("Estado");

const tituloFormulario = document.getElementById("tituloFormulario");
const modoFormulario = document.getElementById("modoFormulario");
const mensajeFormulario = document.getElementById("mensajeFormulario");
const toast = document.getElementById("toast");

function mostrarToast(mensaje, tipo = "success") {
  toast.className = "toast";
  if (tipo === "success") toast.classList.add("toast-success");
  if (tipo === "info") toast.classList.add("toast-info");
  if (tipo === "error") toast.classList.add("toast-error");

  toast.textContent = mensaje;
  toast.classList.remove("hidden");

  setTimeout(() => {
    toast.classList.add("hidden");
  }, 2500);
}

function formatearFecha(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

async function cargarEstudiante() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar estudiante";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos del estudiante...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const estudiante = await response.json();

    if (!response.ok) {
      throw new Error(estudiante.error || "No se pudo cargar el estudiante");
    }

    mongoIdInput.value = estudiante._id ?? "";
    idEstudianteInput.value = estudiante.IdEstudiante ?? "";
    nombreInput.value = estudiante.Nombre ?? "";
    fechaNacimientoInput.value = formatearFecha(estudiante.FechaNacimiento);
    generoInput.value = estudiante.Genero ?? "";
    idGrupoInput.value = estudiante.IdGrupo ?? "";
    estadoInput.value = estudiante.Estado ?? "Activo";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar el estudiante.";
    console.error(error);
    mostrarToast(error.message || "Error al cargar estudiante.", "error");
  }
}

async function guardarEstudiante(e) {
  e.preventDefault();

  const payload = {
    IdEstudiante: Number(idEstudianteInput.value),
    Nombre: nombreInput.value.trim(),
    FechaNacimiento: fechaNacimientoInput.value,
    Genero: generoInput.value,
    IdGrupo: idGrupoInput.value ? Number(idGrupoInput.value) : null,
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
      ? "Estudiante actualizado correctamente."
      : "Estudiante creado correctamente.";

    mostrarToast(
      idMongo
        ? "Estudiante actualizado correctamente."
        : "Estudiante creado correctamente.",
      idMongo ? "info" : "success"
    );

    setTimeout(() => {
      window.location.href = "estudiantes.html";
    }, 1200);
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar el estudiante.";
    console.error(error);
    mostrarToast(error.message || "Error al guardar estudiante.", "error");
  }
}

formEstudiante.addEventListener("submit", guardarEstudiante);

cargarEstudiante();