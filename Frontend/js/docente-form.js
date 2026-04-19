const API_URL = "http://localhost:5000/api/docentes";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formDocente = document.getElementById("formDocente");
const mongoIdInput = document.getElementById("mongoId");
const idDocenteInput = document.getElementById("IdDocente");
const nombreInput = document.getElementById("Nombre");
const especialidadInput = document.getElementById("Especialidad");
const telefonoInput = document.getElementById("Telefono");
const correoInput = document.getElementById("Correo");
const estadoInput = document.getElementById("Estado");

const tituloFormulario = document.getElementById("tituloFormulario");
const modoFormulario = document.getElementById("modoFormulario");
const mensajeFormulario = document.getElementById("mensajeFormulario");

async function cargarDocente() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar docente";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos del docente...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const docente = await response.json();

    if (!response.ok) {
      throw new Error(docente.error || "No se pudo cargar el docente");
    }

    mongoIdInput.value = docente._id ?? "";
    idDocenteInput.value = docente.IdDocente ?? "";
    nombreInput.value = docente.Nombre ?? "";
    especialidadInput.value = docente.Especialidad ?? "";
    telefonoInput.value = docente.Telefono ?? "";
    correoInput.value = docente.Correo ?? "";
    estadoInput.value = docente.Estado ?? "Activo";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar el docente.";
    alert(error.message);
    console.error(error);
  }
}

async function guardarDocente(e) {
  e.preventDefault();

  const payload = {
    IdDocente: Number(idDocenteInput.value),
    Nombre: nombreInput.value.trim(),
    Especialidad: especialidadInput.value.trim(),
    Telefono: telefonoInput.value.trim(),
    Correo: correoInput.value.trim(),
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

    alert(idMongo ? "Docente actualizado correctamente." : "Docente creado correctamente.");
    window.location.href = "docentes.html";
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar el docente.";
    alert(error.message);
    console.error(error);
  }
}

formDocente.addEventListener("submit", guardarDocente);

cargarDocente();