const API_URL = "http://localhost:5000/api/padres";

const tablaPadres = document.getElementById("tablaPadres");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let padresGlobal = [];

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
  tablaPadres.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    mensajeEstado.textContent = "No hay padres registrados.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${items.length} padres correctamente.`;

  items.forEach((item) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.IdPadre ?? ""}</td>
      <td>${item.Nombre ?? ""}</td>
      <td>${item.Telefono ?? ""}</td>
      <td>${item.Correo ?? ""}</td>
      <td>${item.Direccion ?? ""}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(item.Estado)}">
          ${item.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="padre-form.html?id=${item._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${item._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaPadres.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarPadre(btn.dataset.id));
  });
}

async function cargarPadres() {
  try {
    mensajeEstado.textContent = "Cargando padres...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    padresGlobal = data;
    llenarTabla(padresGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar los padres desde el backend.";
    mostrarMensaje("Error al cargar padres.", "error");
  }
}

async function eliminarPadre(idMongo) {
  const confirmado = confirm("¿Deseas eliminar este padre?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Padre eliminado correctamente.";
    mostrarMensaje("Padre eliminado correctamente.", "error");
    await cargarPadres();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar el padre.";
    mostrarMensaje(error.message || "Error al eliminar.", "error");
  }
}

function filtrarPadres() {
  const texto = buscador.value.toLowerCase().trim();

  const filtrados = padresGlobal.filter((item) =>
    (item.Nombre || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtrados);
}

if (buscador) {
  buscador.addEventListener("input", filtrarPadres);
}

cargarPadres();