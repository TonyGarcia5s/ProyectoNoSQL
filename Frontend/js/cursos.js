const API_URL = "http://localhost:5000/api/cursos";

const tablaCursos = document.getElementById("tablaCursos");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let cursosGlobal = [];

function mostrarMensaje(texto, tipo = "success") {
  const mensaje = document.createElement("div");
  mensaje.className = `toast-msg toast-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 2200);
}

function obtenerClaseEstado(estado) {
  return estado && estado.toLowerCase() === "activo"
    ? "status-active"
    : "status-inactive";
}

function llenarTabla(items) {
  tablaCursos.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    mensajeEstado.textContent = "No hay cursos registrados.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${items.length} cursos correctamente.`;

  items.forEach((item) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.IdCurso ?? ""}</td>
      <td>${item.Nombre ?? ""}</td>
      <td>${item.IdMateria ?? ""}</td>
      <td>${item.IdDocente ?? ""}</td>
      <td>${item.IdGrupo ?? ""}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(item.Estado)}">
          ${item.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="curso-form.html?id=${item._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${item._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaCursos.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarCurso(btn.dataset.id));
  });
}

async function cargarCursos() {
  try {
    mensajeEstado.textContent = "Cargando cursos...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    cursosGlobal = data;
    llenarTabla(cursosGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar los cursos desde el backend.";
    mostrarMensaje("Error al cargar cursos.", "error");
  }
}

async function eliminarCurso(idMongo) {
  const confirmado = confirm("¿Deseas eliminar este curso?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Curso eliminado correctamente.";
    mostrarMensaje("Curso eliminado correctamente.", "error");
    await cargarCursos();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar el curso.";
    mostrarMensaje(error.message || "Error al eliminar.", "error");
  }
}

function filtrarCursos() {
  const texto = buscador.value.toLowerCase().trim();

  const filtrados = cursosGlobal.filter((item) =>
    (item.Nombre || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtrados);
}

if (buscador) {
  buscador.addEventListener("input", filtrarCursos);
}

cargarCursos();