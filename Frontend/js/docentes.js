const API_URL = "http://localhost:5000/api/docentes";

const tablaDocentes = document.getElementById("tablaDocentes");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let docentesGlobal = [];

function obtenerClaseEstado(estado) {
  return estado && estado.toLowerCase() === "activo"
    ? "status-active"
    : "status-inactive";
}

function llenarTabla(docentes) {
  tablaDocentes.innerHTML = "";

  if (!Array.isArray(docentes) || docentes.length === 0) {
    mensajeEstado.textContent = "No hay docentes registrados.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${docentes.length} docentes correctamente.`;

  docentes.forEach((docente) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${docente.IdDocente ?? ""}</td>
      <td>${docente.Nombre ?? ""}</td>
      <td>${docente.Especialidad ?? ""}</td>
      <td>${docente.Telefono ?? ""}</td>
      <td>${docente.Correo ?? ""}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(docente.Estado)}">
          ${docente.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="docente-form.html?id=${docente._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${docente._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaDocentes.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarDocente(btn.dataset.id));
  });
}

async function cargarDocentes() {
  try {
    mensajeEstado.textContent = "Cargando docentes...";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    docentesGlobal = data;
    llenarTabla(docentesGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar los docentes desde el backend.";
  }
}

async function eliminarDocente(idMongo) {
  const confirmado = confirm("¿Deseas eliminar este docente?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Docente eliminado correctamente.";
    await cargarDocentes();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar el docente.";
    alert(error.message || "Error al eliminar.");
  }
}

function filtrarDocentes() {
  const texto = buscador.value.toLowerCase().trim();

  const filtrados = docentesGlobal.filter((docente) =>
    (docente.Nombre || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtrados);
}

if (buscador) {
  buscador.addEventListener("input", filtrarDocentes);
}

cargarDocentes();