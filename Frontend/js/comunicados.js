const API_URL = "http://localhost:5000/api/comunicados";

const tablaComunicados = document.getElementById("tablaComunicados");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let comunicadosGlobal = [];

function mostrarMensaje(texto, tipo = "success") {
  const mensaje = document.createElement("div");
  mensaje.className = `toast-msg toast-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 2200);
}

function obtenerClaseEstado(estado) {
  return estado && estado.toLowerCase() === "publicado"
    ? "status-active"
    : "status-inactive";
}

function formatearFecha(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function llenarTabla(comunicados) {
  tablaComunicados.innerHTML = "";

  if (!Array.isArray(comunicados) || comunicados.length === 0) {
    mensajeEstado.textContent = "No hay comunicados registrados.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${comunicados.length} comunicados correctamente.`;

  comunicados.forEach((item) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.IdComunicado ?? ""}</td>
      <td>${item.Titulo ?? ""}</td>
      <td>${item.Mensaje ?? ""}</td>
      <td>${formatearFecha(item.Fecha)}</td>
      <td>${item.DirigidoA ?? ""}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(item.Estado)}">
          ${item.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="comunicado-form.html?id=${item._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${item._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaComunicados.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarComunicado(btn.dataset.id));
  });
}

async function cargarComunicados() {
  try {
    mensajeEstado.textContent = "Cargando comunicados...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    comunicadosGlobal = data;
    llenarTabla(comunicadosGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar los comunicados desde el backend.";
    mostrarMensaje("Error al cargar comunicados.", "error");
  }
}

async function eliminarComunicado(idMongo) {
  const confirmado = confirm("¿Deseas eliminar este comunicado?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Comunicado eliminado correctamente.";
    mostrarMensaje("Comunicado eliminado correctamente.", "error");
    await cargarComunicados();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar el comunicado.";
    mostrarMensaje(error.message || "Error al eliminar.", "error");
  }
}

function filtrarComunicados() {
  const texto = buscador.value.toLowerCase().trim();

  const filtrados = comunicadosGlobal.filter((item) =>
    (item.Titulo || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtrados);
}

if (buscador) {
  buscador.addEventListener("input", filtrarComunicados);
}

cargarComunicados();