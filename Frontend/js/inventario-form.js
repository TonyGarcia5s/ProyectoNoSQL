const API_URL = "http://localhost:5000/api/inventario";

const tablaInventario = document.getElementById("tablaInventario");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let inventarioGlobal = [];

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

function llenarTabla(items) {
  tablaInventario.innerHTML = "";

  if (!Array.isArray(items) || items.length === 0) {
    mensajeEstado.textContent = "No hay artículos registrados.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${items.length} artículos correctamente.`;

  items.forEach((item) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.IdInventario ?? ""}</td>
      <td>${item.Articulo ?? ""}</td>
      <td>${item.Descripcion ?? ""}</td>
      <td>${item.Cantidad ?? ""}</td>
      <td>${item.Precio ?? ""}</td>
      <td>
        <span class="status-badge ${obtenerClaseEstado(item.Estado)}">
          ${item.Estado ?? ""}
        </span>
      </td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="inventario-form.html?id=${item._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${item._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaInventario.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarArticulo(btn.dataset.id));
  });
}

async function cargarInventario() {
  try {
    mensajeEstado.textContent = "Cargando inventario...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    inventarioGlobal = data;
    llenarTabla(inventarioGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar el inventario desde el backend.";
    mostrarMensaje("Error al cargar inventario.", "error");
  }
}

async function eliminarArticulo(idMongo) {
  const confirmado = confirm("¿Deseas eliminar este artículo?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Artículo eliminado correctamente.";
    mostrarMensaje("Artículo eliminado correctamente.", "error");
    await cargarInventario();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar el artículo.";
    mostrarMensaje(error.message || "Error al eliminar.", "error");
  }
}

function filtrarInventario() {
  const texto = buscador.value.toLowerCase().trim();

  const filtrados = inventarioGlobal.filter((item) =>
    (item.Articulo || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtrados);
}

if (buscador) {
  buscador.addEventListener("input", filtrarInventario);
}

cargarInventario();