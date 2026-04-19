const API_URL = "http://localhost:5000/api/aulas";

const tablaAulas = document.getElementById("tablaAulas");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let aulasGlobal = [];

function mostrarMensaje(texto, tipo = "success") {
  const mensaje = document.createElement("div");
  mensaje.className = `toast-msg toast-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 2200);
}

function obtenerClaseEstado(estado) {
  return estado && estado.toLowerCase() === "disponible"
    ? "status-active"
    : "status-inactive";
}

function llenarTabla(aulas) {
  tablaAulas.innerHTML = "";

  if (!Array.isArray(aulas) || aulas.length === 0) {
    mensajeEstado.textContent = "No hay aulas registradas.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${aulas.length} aulas correctamente.`;

  aulas.forEach((aula) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${aula.IdAula ?? ""}</td>
      <td>${aula.NombreAula ?? ""}</td>
      <td>${aula.Capacidad ?? ""}</td>
      <td>${aula.Ubicacion ?? ""}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(aula.Estado)}">
          ${aula.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="aula-form.html?id=${aula._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${aula._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaAulas.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarAula(btn.dataset.id));
  });
}

async function cargarAulas() {
  try {
    mensajeEstado.textContent = "Cargando aulas...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    aulasGlobal = data;
    llenarTabla(aulasGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar las aulas desde el backend.";
    mostrarMensaje("Error al cargar aulas.", "error");
  }
}

async function eliminarAula(idMongo) {
  const confirmado = confirm("¿Deseas eliminar esta aula?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Aula eliminada correctamente.";
    mostrarMensaje("Aula eliminada correctamente.", "error");
    await cargarAulas();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar el aula.";
    mostrarMensaje(error.message || "Error al eliminar.", "error");
  }
}

function filtrarAulas() {
  const texto = buscador.value.toLowerCase().trim();

  const filtradas = aulasGlobal.filter((aula) =>
    (aula.NombreAula || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtradas);
}

if (buscador) {
  buscador.addEventListener("input", filtrarAulas);
}

cargarAulas();