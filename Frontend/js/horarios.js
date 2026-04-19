const API_URL = "http://localhost:5000/api/horarios";

const tablaHorarios = document.getElementById("tablaHorarios");
const mensajeEstado = document.getElementById("mensajeEstado");
const buscador = document.getElementById("buscador");

let horariosGlobal = [];

function mostrarMensaje(texto, tipo = "success") {
  const mensaje = document.createElement("div");
  mensaje.className = `toast-msg toast-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 2200);
}

function llenarTabla(horarios) {
  tablaHorarios.innerHTML = "";

  if (!Array.isArray(horarios) || horarios.length === 0) {
    mensajeEstado.textContent = "No hay horarios registrados.";
    return;
  }

  mensajeEstado.textContent = `Se cargaron ${horarios.length} horarios correctamente.`;

  horarios.forEach((item) => {
    const fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${item.IdHorario ?? ""}</td>
      <td>${item.IdCurso ?? ""}</td>
      <td>${item.IdAula ?? ""}</td>
      <td>${item.Dia ?? ""}</td>
      <td>${item.HoraInicio ?? ""}</td>
      <td>${item.HoraFin ?? ""}</td>
      <td>
        <div class="actions">
          <a class="btn-action btn-edit" href="horario-form.html?id=${item._id}">
            <i class="fa-solid fa-pen-to-square"></i> Editar
          </a>
          <button type="button" class="btn-action btn-delete" data-id="${item._id}">
            <i class="fa-solid fa-trash"></i> Eliminar
          </button>
        </div>
      </td>
    `;

    tablaHorarios.appendChild(fila);
  });

  document.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => eliminarHorario(btn.dataset.id));
  });
}

async function cargarHorarios() {
  try {
    mensajeEstado.textContent = "Cargando horarios...";
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("No se pudo obtener la información");
    }

    const data = await response.json();
    horariosGlobal = data;
    llenarTabla(horariosGlobal);
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al cargar los horarios desde el backend.";
    mostrarMensaje("Error al cargar horarios.", "error");
  }
}

async function eliminarHorario(idMongo) {
  const confirmado = confirm("¿Deseas eliminar este horario?");
  if (!confirmado) return;

  try {
    const response = await fetch(`${API_URL}/${idMongo}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo eliminar");
    }

    mensajeEstado.textContent = "Horario eliminado correctamente.";
    mostrarMensaje("Horario eliminado correctamente.", "error");
    await cargarHorarios();
  } catch (error) {
    console.error(error);
    mensajeEstado.textContent = "Error al eliminar el horario.";
    mostrarMensaje(error.message || "Error al eliminar.", "error");
  }
}

function filtrarHorarios() {
  const texto = buscador.value.toLowerCase().trim();

  const filtrados = horariosGlobal.filter((item) =>
    (item.Dia || "").toLowerCase().includes(texto)
  );

  llenarTabla(filtrados);
}

if (buscador) {
  buscador.addEventListener("input", filtrarHorarios);
}

cargarHorarios();