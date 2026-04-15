const API_URL = "http://localhost:5000/api/grupos";

const tablaGrupos = document.getElementById("tablaGrupos");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let gruposGlobal = [];

function obtenerClaseEstado(estado) {
  return estado && estado.toLowerCase() === "activo"
    ? "status-active"
    : "status-inactive";
}

function llenarTabla(grupos) {
  tablaGrupos.innerHTML = "";

  if (!Array.isArray(grupos) || grupos.length === 0) {
    mensajeEstado.textContent = "No hay grupos registrados.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${grupos.length} grupos correctamente.`;

  grupos.forEach((grupo) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${grupo.IdGrupo ?? ""}</td>
      <td>${grupo.Nombre ?? ""}</td>
      <td>${grupo.Nivel ?? ""}</td>
      <td>${grupo.Seccion ?? ""}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(grupo.Estado)}">
          ${grupo.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="grupo-form.html?id=${grupo._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${grupo._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaGrupos.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarGrupo(btn.dataset.id));
  });
}

async function cargarGrupos() {
  try {
    mensajeEstado.textContent = "Cargando grupos...";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    gruposGlobal = data;
    llenarTabla(gruposGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar los grupos desde el backend.";
  }
}

async function eliminarGrupo(idMongo) {
  const confirmado = confirm("¿Deseas eliminar este grupo?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Grupo eliminado correctamente.";
    await cargarGrupos();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar el grupo.";
    alert(error.message || "Error al eliminar.");
  }
}

function filtrarGrupos() {
  const texto = buscador.value.toLowerCase().trim();

  const filtrados = gruposGlobal.filter((grupo) =>
    (grupo.Nombre || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtrados);
}

if (buscador) {
  buscador.addEventListener("input", filtrarGrupos);
}

cargarGrupos();