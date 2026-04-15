const API_URL = "http://localhost:5000/api/aulas";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formAula = document.getElementById("formAula");
const mongoIdInput = document.getElementById("mongoId");
const idAulaInput = document.getElementById("IdAula");
const nombreAulaInput = document.getElementById("NombreAula");
const capacidadInput = document.getElementById("Capacidad");
const ubicacionInput = document.getElementById("Ubicacion");
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

async function cargarAula() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar aula";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos del aula...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const aula = await response.json();

    if (!response.ok) {
      throw new Error(aula.error || "No se pudo cargar el aula");
    }

    mongoIdInput.value = aula._id ?? "";
    idAulaInput.value = aula.IdAula ?? "";
    nombreAulaInput.value = aula.NombreAula ?? "";
    capacidadInput.value = aula.Capacidad ?? "";
    ubicacionInput.value = aula.Ubicacion ?? "";
    estadoInput.value = aula.Estado ?? "Disponible";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar el aula.";
    console.error(error);
    mostrarMensaje(error.message || "Error al cargar aula.", "error");
  }
}

async function guardarAula(e) {
  e.preventDefault();

  const payload = {
    IdAula: Number(idAulaInput.value),
    NombreAula: nombreAulaInput.value.trim(),
    Capacidad: Number(capacidadInput.value),
    Ubicacion: ubicacionInput.value.trim(),
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
      ? "Aula actualizada correctamente."
      : "Aula creada correctamente.";

    mostrarMensaje(
      idMongo ? "Aula actualizada correctamente." : "Aula creada correctamente.",
      idMongo ? "info" : "success"
    );

    setTimeout(() => {
      window.location.href = "aulas.html";
    }, 900);
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar el aula.";
    console.error(error);
    mostrarMensaje(error.message || "Error al guardar aula.", "error");
  }
}

formAula.addEventListener("submit", guardarAula);

cargarAula();