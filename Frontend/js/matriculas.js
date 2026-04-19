const API_URL = "http://localhost:5000/api/matriculas";

const tablaMatriculas = document.getElementById("tablaMatriculas");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let matriculasGlobal = [];

function mostrarMensaje(texto, tipo = "success") {
  const mensaje = document.createElement("div");
  mensaje.className = `toast-msg toast-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 2200);
}

function obtenerClaseEstado(estado) {
  return estado && estado.toLowerCase() === "activa"
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
  tablaMatriculas.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    mensajeEstado.textContent = "No hay matrículas registradas.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${items.length} matrículas correctamente.`;

  items.forEach((item) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.IdMatricula ?? ""}</td>
      <td>${item.IdEstudiante ?? ""}</td>
      <td>${item.Periodo ?? ""}</td>
      <td>${formatearFecha(item.Fecha)}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(item.Estado)}">
          ${item.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="matricula-form.html?id=${item._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${item._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaMatriculas.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarMatricula(btn.dataset.id));
  });
}

async function cargarMatriculas() {
  try {
    mensajeEstado.textContent = "Cargando matrículas...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    matriculasGlobal = data;
    llenarTabla(matriculasGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar las matrículas desde el backend.";
    mostrarMensaje("Error al cargar matrículas.", "error");
  }
}

async function eliminarMatricula(idMongo) {
  const confirmado = confirm("¿Deseas eliminar esta matrícula?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Matrícula eliminada correctamente.";
    mostrarMensaje("Matrícula eliminada correctamente.", "error");
    await cargarMatriculas();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar la matrícula.";
    mostrarMensaje(error.message || "Error al eliminar.", "error");
  }
}

function filtrarMatriculas() {
  const texto = buscador.value.toLowerCase().trim();

  const filtrados = matriculasGlobal.filter((item) =>
    (item.Periodo || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtrados);
}

if (buscador) {
  buscador.addEventListener("input", filtrarMatriculas);
}

cargarMatriculas();