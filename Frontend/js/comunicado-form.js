const API_URL = "http://localhost:5000/api/comunicados";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formComunicado = document.getElementById("formComunicado");
const mongoIdInput = document.getElementById("mongoId");
const idComunicadoInput = document.getElementById("IdComunicado");
const tituloInput = document.getElementById("Titulo");
const mensajeInput = document.getElementById("Mensaje");
const fechaInput = document.getElementById("Fecha");
const dirigidoAInput = document.getElementById("DirigidoA");
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

async function cargarComunicado() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar comunicado";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos del comunicado...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const item = await response.json();

    if (!response.ok) {
      throw new Error(item.error || "No se pudo cargar el comunicado");
    }

    mongoIdInput.value = item._id ?? "";
    idComunicadoInput.value = item.IdComunicado ?? "";
    tituloInput.value = item.Titulo ?? "";
    mensajeInput.value = item.Mensaje ?? "";
    fechaInput.value = formatearFecha(item.Fecha);
    dirigidoAInput.value = item.DirigidoA ?? "Todos";
    estadoInput.value = item.Estado ?? "Publicado";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar el comunicado.";
    console.error(error);
    mostrarMensaje(error.message || "Error al cargar comunicado.", "error");
  }
}

async function guardarComunicado(e) {
  e.preventDefault();

  const payload = {
    IdComunicado: Number(idComunicadoInput.value),
    Titulo: tituloInput.value.trim(),
    Mensaje: mensajeInput.value.trim(),
    Fecha: fechaInput.value,
    DirigidoA: dirigidoAInput.value,
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
      ? "Comunicado actualizado correctamente."
      : "Comunicado creado correctamente.";

    mostrarMensaje(
      idMongo ? "Comunicado actualizado correctamente." : "Comunicado creado correctamente.",
      idMongo ? "info" : "success"
    );

    setTimeout(() => {
      window.location.href = "comunicados.html";
    }, 900);
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar el comunicado.";
    console.error(error);
    mostrarMensaje(error.message || "Error al guardar comunicado.", "error");
  }
}

formComunicado.addEventListener("submit", guardarComunicado);

cargarComunicado();