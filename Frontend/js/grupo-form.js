const API_URL = "http://localhost:5000/api/grupos";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formGrupo = document.getElementById("formGrupo");
const mongoIdInput = document.getElementById("mongoId");
const idGrupoInput = document.getElementById("IdGrupo");
const nombreInput = document.getElementById("Nombre");
const nivelInput = document.getElementById("Nivel");
const seccionInput = document.getElementById("Seccion");
const estadoInput = document.getElementById("Estado");

const tituloFormulario = document.getElementById("tituloFormulario");
const modoFormulario = document.getElementById("modoFormulario");
const mensajeFormulario = document.getElementById("mensajeFormulario");

async function cargarGrupo() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar grupo";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos del grupo...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const grupo = await response.json();

    if (!response.ok) {
      throw new Error(grupo.error || "No se pudo cargar el grupo");
    }

    mongoIdInput.value = grupo._id ?? "";
    idGrupoInput.value = grupo.IdGrupo ?? "";
    nombreInput.value = grupo.Nombre ?? "";
    nivelInput.value = grupo.Nivel ?? "";
    seccionInput.value = grupo.Seccion ?? "";
    estadoInput.value = grupo.Estado ?? "Activo";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar el grupo.";
    alert(error.message);
    console.error(error);
  }
}

async function guardarGrupo(e) {
  e.preventDefault();

  const payload = {
    IdGrupo: Number(idGrupoInput.value),
    Nombre: nombreInput.value.trim(),
    Nivel: nivelInput.value.trim(),
    Seccion: seccionInput.value.trim(),
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

    alert(idMongo ? "Grupo actualizado correctamente." : "Grupo creado correctamente.");
    window.location.href = "grupos.html";
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar el grupo.";
    alert(error.message);
    console.error(error);
  }
}

formGrupo.addEventListener("submit", guardarGrupo);

cargarGrupo();