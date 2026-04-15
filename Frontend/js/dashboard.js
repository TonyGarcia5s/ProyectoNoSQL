const API_URL = "http://localhost:5000/api/estudiantes";

async function cargarCantidadEstudiantes() {
  const cantidadEl = document.getElementById("cantidadEstudiantes");
  const heroEl = document.getElementById("cantidadEstudiantesHero");

  if (!cantidadEl || !heroEl) return;

  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    const cantidad = Array.isArray(data) ? data.length : 0;

    cantidadEl.textContent = cantidad;
    heroEl.textContent = cantidad;
  } catch (error) {
    cantidadEl.textContent = "--";
    heroEl.textContent = "--";
    console.error("Error al cargar estudiantes:", error);
  }
}

function actualizarRelojYSaludo() {
  const reloj = document.getElementById("relojDashboard");
  const fecha = document.getElementById("fechaDashboard");
  const saludo = document.getElementById("saludoDashboard");

  const ahora = new Date();
  const hora = ahora.getHours();
  const minutos = String(ahora.getMinutes()).padStart(2, "0");
  const horas = String(hora).padStart(2, "0");

  if (reloj) {
    reloj.textContent = `${horas}:${minutos}`;
  }

  if (fecha) {
    fecha.textContent = ahora.toLocaleDateString("es-CR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  }

  if (saludo) {
    let texto = "Bienvenido";
    if (hora < 12) texto = "Buenos días";
    else if (hora < 18) texto = "Buenas tardes";
    else texto = "Buenas noches";

    saludo.textContent = texto;
  }
}

cargarCantidadEstudiantes();
actualizarRelojYSaludo();
setInterval(actualizarRelojYSaludo, 1000);