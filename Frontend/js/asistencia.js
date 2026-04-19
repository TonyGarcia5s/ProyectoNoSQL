const API_URL = "http://localhost:5000/api/asistencias";

const tablaAsistencia = document.getElementById("tablaAsistencia");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let asistenciaGlobal = [];

function mostrarMensaje(texto, tipo = "success") {
  const mensaje = document.createElement("div");
  mensaje.className = `toast-msg toast-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 2200);
}

function obtenerClaseEstado(estado) {
  const valor = (estado || "").toLowerCase();
  if (valor === "presente") return "status-active";
  return "status-inactive";
}

function formatearFecha(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function llenarTabla(asistencias) {
  tablaAsistencia.innerHTML = "";

  if (!Array.isArray(asistencias) || asistencias.length === 0) {
    mensajeEstado.textContent = "No hay asistencias registradas.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${asistencias.length} asistencias correctamente.`;

  asistencias.forEach((item) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.IdAsistencia ?? ""}</td>
      <td>${item.IdEstudiante ?? ""}</td>
      <td>${formatearFecha(item.Fecha)}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(item.Estado)}">
          ${item.Estado ?? ""}
        </span>
      </td>
      <td>${item.Observacion ?? ""}</td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="asistencia-form.html?id=${item._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${item._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaAsistencia.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarAsistencia(btn.dataset.id));
  });
}

async function cargarAsistencia() {
  try {
    mensajeEstado.textContent = "Cargando asistencias...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    asistenciaGlobal = data;
    llenarTabla(asistenciaGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar la asistencia desde el backend.";
    mostrarMensaje("Error al cargar asistencia.", "error");
  }
}

async function eliminarAsistencia(idMongo) {
  const confirmado = confirm("¿Deseas eliminar esta asistencia?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Asistencia eliminada correctamente.";
    mostrarMensaje("Asistencia eliminada correctamente.", "error");
    await cargarAsistencia();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar la asistencia.";
    mostrarMensaje(error.message || "Error al eliminar.", "error");
  }
}

function filtrarAsistencia() {
  const texto = buscador.value.toLowerCase().trim();

  const filtradas = asistenciaGlobal.filter((item) =>
    String(item.IdEstudiante ?? "").toLowerCase().includes(texto)
  );

  llenarTabla(filtradas);
}

if (buscador) {
  buscador.addEventListener("input", filtrarAsistencia);
}

cargarAsistencia();