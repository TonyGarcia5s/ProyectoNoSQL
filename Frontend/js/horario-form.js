const API_URL = "http://localhost:5000/api/horarios";

const params = new URLSearchParams(window.location.search);
const idMongo = params.get("id");

const formHorario = document.getElementById("formHorario");
const mongoIdInput = document.getElementById("mongoId");
const idHorarioInput = document.getElementById("IdHorario");
const idCursoInput = document.getElementById("IdCurso");
const idAulaInput = document.getElementById("IdAula");
const diaInput = document.getElementById("Dia");
const horaInicioInput = document.getElementById("HoraInicio");
const horaFinInput = document.getElementById("HoraFin");

const tituloFormulario = document.getElementById("tituloFormulario");
const modoFormulario = document.getElementById("modoFormulario");
const mensajeFormulario = document.getElementById("mensajeFormulario");

function mostrarMensaje(texto, tipo = "success") {
  const mensaje = document.createElement("div");
  mensaje.className = `toast-msg toast-${tipo}`;
  mensaje.textContent = texto;
  document.body.appendChild(mensaje);
  setTimeout(() => mensaje.remove(), 2200);
}

async function cargarHorario() {
  if (!idMongo) return;

  try {
    tituloFormulario.textContent = "Editar horario";
    modoFormulario.textContent = "Modo edición";
    mensajeFormulario.textContent = "Cargando datos del horario...";

    const response = await fetch(`${API_URL}/${idMongo}`);
    const item = await response.json();

    if (!response.ok) {
      throw new Error(item.error || "No se pudo cargar el horario");
    }

    mongoIdInput.value = item._id ?? "";
    idHorarioInput.value = item.IdHorario ?? "";
    idCursoInput.value = item.IdCurso ?? "";
    idAulaInput.value = item.IdAula ?? "";
    diaInput.value = item.Dia ?? "Lunes";
    horaInicioInput.value = item.HoraInicio ?? "";
    horaFinInput.value = item.HoraFin ?? "";

    mensajeFormulario.textContent = "Edita la información y guarda los cambios.";
  } catch (error) {
    mensajeFormulario.textContent = "Error al cargar el horario.";
    console.error(error);
    mostrarMensaje(error.message || "Error al cargar horario.", "error");
  }
}

async function guardarHorario(e) {
  e.preventDefault();

  const payload = {
    IdHorario: Number(idHorarioInput.value),
    IdCurso: Number(idCursoInput.value),
    IdAula: Number(idAulaInput.value),
    Dia: diaInput.value,
    HoraInicio: horaInicioInput.value,
    HoraFin: horaFinInput.value,
  };

  try {
    let response;

    if (idMongo) {
      response = await fetch(`${API_URL}/${idMongo}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    } else {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "No se pudo guardar");
    }

    mensajeFormulario.textContent = idMongo
      ? "Horario actualizado correctamente."
      : "Horario creado correctamente.";

    mostrarMensaje(
      idMongo ? "Horario actualizado correctamente." : "Horario creado correctamente.",
      idMongo ? "info" : "success"
    );

    setTimeout(() => {
      window.location.href = "horarios.html";
    }, 900);
  } catch (error) {
    mensajeFormulario.textContent = "Error al guardar el horario.";
    console.error(error);
    mostrarMensaje(error.message || "Error al guardar horario.", "error");
  }
}

formHorario.addEventListener("submit", guardarHorario);

cargarHorario();