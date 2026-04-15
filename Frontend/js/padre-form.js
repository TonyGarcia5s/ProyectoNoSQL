const API_URL = "http://localhost:5000/api/padres";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formPadre = document.getElementById("formPadre");
const mongoIdInput = document.getElementById("mongoId");
const idPadreInput = document.getElementById("IdPadre");
const nombreInput = document.getElementById("Nombre");
const telefonoInput = document.getElementById("Telefono");
const correoInput = document.getElementById("Correo");
const direccionInput = document.getElementById("Direccion");
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

async function cargarPadre() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar padre";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos del padre...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const item = await response.json();

    if (!response.ok) {
      throw new Error(item.error || "No se pudo cargar el padre");
    }

    mongoIdInput.value = item._id ?? "";
    idPadreInput.value = item.IdPadre ?? "";
    nombreInput.value = item.Nombre ?? "";
    telefonoInput.value = item.Telefono ?? "";
    correoInput.value = item.Correo ?? "";
    direccionInput.value = item.Direccion ?? "";
    estadoInput.value = item.Estado ?? "Activo";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar el padre.";
    console.error(error);
    mostrarMensaje(error.message || "Error al cargar padre.", "error");
  }
}

async function guardarPadre(e) {
  e.preventDefault();

  const payload = {
    IdPadre: Number(idPadreInput.value),
    Nombre: nombreInput.value.trim(),
    Telefono: telefonoInput.value.trim(),
    Correo: correoInput.value.trim(),
    Direccion: direccionInput.value.trim(),
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
      ? "Padre actualizado correctamente."
      : "Padre creado correctamente.";

    mostrarMensaje(
      idMongo ? "Padre actualizado correctamente." : "Padre creado correctamente.",
      idMongo ? "info" : "success"
    );

    setTimeout(() => {
      window.location.href = "padres.html";
    }, 900);
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar el padre.";
    console.error(error);
    mostrarMensaje(error.message || "Error al guardar padre.", "error");
  }
}

formPadre.addEventListener("submit", guardarPadre);

cargarPadre();