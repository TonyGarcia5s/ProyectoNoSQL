const API_URL = "http://localhost:5000/api/notas";

const tablaNotas = document.getElementById("tablaNotas");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let notasGlobal = [];

function mostrarMensaje(texto, tipo = "success") {
  const mensaje = document.createElement("div");
  mensaje.className = `toast-msg toast-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 2200);
}

function obtenerClaseEstado(estado) {
  return estado && estado.toLowerCase() === "registrada"
    ? "status-active"
    : "status-inactive";
}

function llenarTabla(notas) {
  tablaNotas.innerHTML = "";

  if (!Array.isArray(notas) || notas.length === 0) {
    mensajeEstado.textContent = "No hay notas registradas.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${notas.length} notas correctamente.`;

  notas.forEach((nota) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${nota.IdNota ?? ""}</td>
      <td>${nota.IdEstudiante ?? ""}</td>
      <td>${nota.IdCurso ?? ""}</td>
      <td>${nota.Periodo ?? ""}</td>
      <td>${nota.Nota ?? ""}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(nota.Estado)}">
          ${nota.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="nota-form.html?id=${nota._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${nota._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaNotas.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarNota(btn.dataset.id));
  });
}

async function cargarNotas() {
  try {
    mensajeEstado.textContent = "Cargando notas...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    notasGlobal = data;
    llenarTabla(notasGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar las notas desde el backend.";
    mostrarMensaje("Error al cargar notas.", "error");
  }
}

async function eliminarNota(idMongo) {
  const confirmado = confirm("¿Deseas eliminar esta nota?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Nota eliminada correctamente.";
    mostrarMensaje("Nota eliminada correctamente.", "error");
    await cargarNotas();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar la nota.";
    mostrarMensaje(error.message || "Error al eliminar.", "error");
  }
}

function filtrarNotas() {
  const texto = buscador.value.toLowerCase().trim();

  const filtradas = notasGlobal.filter((nota) =>
    String(nota.IdEstudiante ?? "").toLowerCase().includes(texto)
  );

  llenarTabla(filtradas);
}

if (buscador) {
  buscador.addEventListener("input", filtrarNotas);
}

cargarNotas();