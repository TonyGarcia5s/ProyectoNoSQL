const API_URL = "http://localhost:5000/api/pagos";

const tablaPagos = document.getElementById("tablaPagos");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let pagosGlobal = [];

function mostrarMensaje(texto, tipo = "success") {
  const mensaje = document.createElement("div");
  mensaje.className = `toast-msg toast-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 2200);
}

function obtenerClaseEstado(estado) {
  return estado && estado.toLowerCase() === "pagado"
    ? "status-active"
    : "status-inactive";
}

function formatearFecha(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function llenarTabla(items) {
  tablaPagos.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    mensajeEstado.textContent = "No hay pagos registrados.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${items.length} pagos correctamente.`;

  items.forEach((item) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.IdPago ?? ""}</td>
      <td>${item.IdEstudiante ?? ""}</td>
      <td>${item.Concepto ?? ""}</td>
      <td>${item.Monto ?? ""}</td>
      <td>${formatearFecha(item.Fecha)}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(item.Estado)}">
          ${item.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="pago-form.html?id=${item._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${item._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaPagos.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarPago(btn.dataset.id));
  });
}

async function cargarPagos() {
  try {
    mensajeEstado.textContent = "Cargando pagos...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    pagosGlobal = data;
    llenarTabla(pagosGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar los pagos desde el backend.";
    mostrarMensaje("Error al cargar pagos.", "error");
  }
}

async function eliminarPago(idMongo) {
  const confirmado = confirm("¿Deseas eliminar este pago?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Pago eliminado correctamente.";
    mostrarMensaje("Pago eliminado correctamente.", "error");
    await cargarPagos();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar el pago.";
    mostrarMensaje(error.message || "Error al eliminar.", "error");
  }
}

function filtrarPagos() {
  const texto = buscador.value.toLowerCase().trim();

  const filtrados = pagosGlobal.filter((item) =>
    (item.Concepto || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtrados);
}

if (buscador) {
  buscador.addEventListener("input", filtrarPagos);
}

cargarPagos();