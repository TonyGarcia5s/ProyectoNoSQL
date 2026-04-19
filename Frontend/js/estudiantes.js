const API_URL = "http://localhost:5000/api/estudiantes";

const tablaEstudiantes = document.getElementById("tablaEstudiantes");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let estudiantesGlobal = [];

function obtenerClaseGenero(genero) {
  return genero === "M" ? "gender-m" : "gender-f";
}

function obtenerClaseEstado(estado) {
  return estado && estado.toLowerCase() === "activo"
    ? "status-active"
    : "status-inactive";
}

function formatearFecha(fecha) {
  if (!fecha) return "";
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().split("T")[0];
}

function llenarTabla(estudiantes) {
  tablaEstudiantes.innerHTML = "";

  if (!Array.isArray(estudiantes) || estudiantes.length === 0) {
    mensajeEstado.textContent = "No hay estudiantes registrados.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${estudiantes.length} estudiantes correctamente.`;

  estudiantes.forEach((estudiante) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${estudiante.IdEstudiante ?? ""}</td>
      <td>${estudiante.Nombre ?? ""}</td>
      <td>${formatearFecha(estudiante.FechaNacimiento)}</td>
      <td>
        <span class="gender-badge ${obtenerClaseGenero(estudiante.Genero)}">
          ${estudiante.Genero ?? ""}
        </span>
      </td>
      <td>${estudiante.IdGrupo ?? ""}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(estudiante.Estado)}">
          ${estudiante.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="estudiante-form.html?id=${estudiante._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${estudiante._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaEstudiantes.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarEstudiante(btn.dataset.id));
  });
}

async function cargarEstudiantes() {
  try {
    mensajeEstado.textContent = "Cargando estudiantes...";

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    estudiantesGlobal = data;
    llenarTabla(estudiantesGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar los estudiantes desde el backend.";
  }
}

async function eliminarEstudiante(idMongo) {
  const confirmado = confirm("¿Deseas eliminar este estudiante?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Estudiante eliminado correctamente.";
    await cargarEstudiantes();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar el estudiante.";
    alert(error.message || "Error al eliminar.");
  }
}

function filtrarEstudiantes() {
  const texto = buscador.value.toLowerCase().trim();

  const filtrados = estudiantesGlobal.filter((estudiante) =>
    (estudiante.Nombre || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtrados);
}

if (buscador) {
  buscador.addEventListener("input", filtrarEstudiantes);
}

cargarEstudiantes();