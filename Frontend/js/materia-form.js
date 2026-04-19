const API_URL = "http://localhost:5000/api/materias";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formMateria = document.getElementById("formMateria");
const mongoIdInput = document.getElementById("mongoId");
const idMateriaInput = document.getElementById("IdMateria");
const nombreInput = document.getElementById("Nombre");
const descripcionInput = document.getElementById("Descripcion");
const estadoInput = document.getElementById("Estado");

const tituloFormulario = document.getElementById("tituloFormulario");
const modoFormulario = document.getElementById("modoFormulario");
const mensajeFormulario = document.getElementById("mensajeFormulario");

async function cargarMateria() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar materia";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos de la materia...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const materia = await response.json();

    if (!response.ok) {
      throw new Error(materia.error || "No se pudo cargar la materia");
    }

    mongoIdInput.value = materia._id ?? "";
    idMateriaInput.value = materia.IdMateria ?? "";
    nombreInput.value = materia.Nombre ?? "";
    descripcionInput.value = materia.Descripcion ?? "";
    estadoInput.value = materia.Estado ?? "Activa";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar la materia.";
    alert(error.message);
    console.error(error);
  }
}

async function guardarMateria(e) {
  e.preventDefault();

  const payload = {
    IdMateria: Number(idMateriaInput.value),
    Nombre: nombreInput.value.trim(),
    Descripcion: descripcionInput.value.trim(),
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

    alert(idMongo ? "Materia actualizada correctamente." : "Materia creada correctamente.");
    window.location.href = "materias.html";
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar la materia.";
    alert(error.message);
    console.error(error);
  }
}

formMateria.addEventListener("submit", guardarMateria);

cargarMateria();