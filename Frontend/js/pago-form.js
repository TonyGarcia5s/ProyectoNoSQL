const API_URL = "http://localhost:5000/api/pagos";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formPago = document.getElementById("formPago");
const mongoIdInput = document.getElementById("mongoId");
const idPagoInput = document.getElementById("IdPago");
const idEstudianteInput = document.getElementById("IdEstudiante");
const conceptoInput = document.getElementById("Concepto");
const montoInput = document.getElementById("Monto");
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

async function cargarPago() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar pago";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos del pago...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const item = await response.json();

    if (!response.ok) {
      throw new Error(item.error || "No se pudo cargar el pago");
    }

    mongoIdInput.value = item._id ?? "";
    idPagoInput.value = item.IdPago ?? "";
    idEstudianteInput.value = item.IdEstudiante ?? "";
    conceptoInput.value = item.Concepto ?? "";
    montoInput.value = item.Monto ?? "";
    fechaInput.value = formatearFecha(item.Fecha);
    estadoInput.value = item.Estado ?? "Pendiente";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar el pago.";
    console.error(error);
    mostrarMensaje(error.message || "Error al cargar pago.", "error");
  }
}

async function guardarPago(e) {
  e.preventDefault();

  const payload = {
    IdPago: Number(idPagoInput.value),
    IdEstudiante: Number(idEstudianteInput.value),
    Concepto: conceptoInput.value.trim(),
    Monto: Number(montoInput.value),
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
      ? "Pago actualizado correctamente."
      : "Pago creado correctamente.";

    mostrarMensaje(
      idMongo ? "Pago actualizado correctamente." : "Pago creado correctamente.",
      idMongo ? "info" : "success"
    );

    setTimeout(() => {
      window.location.href = "pagos.html";
    }, 900);
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar el pago.";
    console.error(error);
    mostrarMensaje(error.message || "Error al guardar pago.", "error");
  }
}

formPago.addEventListener("submit", guardarPago);

cargarPago();