const API_URL = "http://localhost:5000/api/evaluaciones";

const tablaEvaluaciones = document.getElementById("tablaEvaluaciones");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let evaluacionesGlobal = [];

function mostrarMensaje(texto, tipo = "success") {
  const mensaje = document.createElement("div");
  mensaje.className = `toast-msg toast-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 2200);
}

function obtenerClaseEstado(estado) {
  return estado && estado.toLowerCase() === "aplicada"
    ? "status-active"
    : "status-inactive";
}

function formatearFecha(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function llenarTabla(evaluaciones) {
  tablaEvaluaciones.innerHTML = "";

  if (!Array.isArray(evaluaciones) || evaluaciones.length === 0) {
    mensajeEstado.textContent = "No hay evaluaciones registradas.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${evaluaciones.length} evaluaciones correctamente.`;

  evaluaciones.forEach((item) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.IdEvaluacion ?? ""}</td>
      <td>${item.IdCurso ?? ""}</td>
      <td>${item.Nombre ?? ""}</td>
      <td>${item.Porcentaje ?? ""}%</td>
      <td>${formatearFecha(item.Fecha)}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(item.Estado)}">
          ${item.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="evaluacion-form.html?id=${item._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${item._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaEvaluaciones.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarEvaluacion(btn.dataset.id));
  });
}

async function cargarEvaluaciones() {
  try {
    mensajeEstado.textContent = "Cargando evaluaciones...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    evaluacionesGlobal = data;
    llenarTabla(evaluacionesGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar las evaluaciones desde el backend.";
    mostrarMensaje("Error al cargar evaluaciones.", "error");
  }
}

async function eliminarEvaluacion(idMongo) {
  const confirmado = confirm("¿Deseas eliminar esta evaluación?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Evaluación eliminada correctamente.";
    mostrarMensaje("Evaluación eliminada correctamente.", "error");
    await cargarEvaluaciones();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar la evaluación.";
    mostrarMensaje(error.message || "Error al eliminar.", "error");
  }
}

function filtrarEvaluaciones() {
  const texto = buscador.value.toLowerCase().trim();

  const filtradas = evaluacionesGlobal.filter((item) =>
    (item.Nombre || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtradas);
}

if (buscador) {
  buscador.addEventListener("input", filtrarEvaluaciones);
}

cargarEvaluaciones();