const API_URL = "http://localhost:5000/api/materias";

const tablaMaterias = document.getElementById("tablaMaterias");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let materiasGlobal = [];

function obtenerClaseEstado(estado) {
  return estado && estado.toLowerCase() === "activa"
    ? "status-active"
    : "status-inactive";
}

function llenarTabla(materias) {
  tablaMaterias.innerHTML = "";

  if (!Array.isArray(materias) || materias.length === 0) {
    mensajeEstado.textContent = "No hay materias registradas.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${materias.length} materias correctamente.`;

  materias.forEach((materia) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${materia.IdMateria ?? ""}</td>
      <td>${materia.Nombre ?? ""}</td>
      <td>${materia.Descripcion ?? ""}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(materia.Estado)}">
          ${materia.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="materia-form.html?id=${materia._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${materia._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaMaterias.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarMateria(btn.dataset.id));
  });
}

async function cargarMaterias() {
  try {
    mensajeEstado.textContent = "Cargando materias...";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    materiasGlobal = data;
    llenarTabla(materiasGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar las materias desde el backend.";
  }
}

async function eliminarMateria(idMongo) {
  const confirmado = confirm("¿Deseas eliminar esta materia?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Materia eliminada correctamente.";
    await cargarMaterias();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar la materia.";
    alert(error.message || "Error al eliminar.");
  }
}

function filtrarMaterias() {
  const texto = buscador.value.toLowerCase().trim();

  const filtradas = materiasGlobal.filter((materia) =>
    (materia.Nombre || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtradas);
}

if (buscador) {
  buscador.addEventListener("input", filtrarMaterias);
}

cargarMaterias();