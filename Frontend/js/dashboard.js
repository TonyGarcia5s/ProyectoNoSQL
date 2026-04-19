const usuario = localStorage.getItem("usuarioLogueado");

if (!usuario) {
  window.location.href = "login.html";
}

const API_ESTUDIANTES = "http://localhost:5000/api/estudiantes";
const API_DOCENTES = "http://localhost:5000/api/docentes";
const API_CURSOS = "http://localhost:5000/api/cursos";
const API_PAGOS = "http://localhost:5000/api/pagos";

let barChartInstance = null;
let doughnutChartInstance = null;

async function obtenerCantidad(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data.length : 0;
  } catch (error) {
    console.error(`Error al consultar ${url}:`, error);
    return 0;
  }
}

async function cargarResumenDashboard() {
  const cantidadEstudiantesEl = document.getElementById("cantidadEstudiantes");
  const cantidadEstudiantesHeroEl = document.getElementById("cantidadEstudiantesHero");
  const cantidadDocentesEl = document.getElementById("cantidadDocentes");
  const cantidadCursosEl = document.getElementById("cantidadCursos");
  const cantidadPagosEl = document.getElementById("cantidadPagos");

  const actividadEstudiantesEl = document.getElementById("actividadEstudiantes");
  const actividadDocentesEl = document.getElementById("actividadDocentes");
  const actividadCursosEl = document.getElementById("actividadCursos");
  const actividadPagosEl = document.getElementById("actividadPagos");

  try {
    const [
      totalEstudiantes,
      totalDocentes,
      totalCursos,
      totalPagos
    ] = await Promise.all([
      obtenerCantidad(API_ESTUDIANTES),
      obtenerCantidad(API_DOCENTES),
      obtenerCantidad(API_CURSOS),
      obtenerCantidad(API_PAGOS)
    ]);

    if (cantidadEstudiantesEl) cantidadEstudiantesEl.textContent = totalEstudiantes;
    if (cantidadEstudiantesHeroEl) cantidadEstudiantesHeroEl.textContent = totalEstudiantes;
    if (cantidadDocentesEl) cantidadDocentesEl.textContent = totalDocentes;
    if (cantidadCursosEl) cantidadCursosEl.textContent = totalCursos;
    if (cantidadPagosEl) cantidadPagosEl.textContent = totalPagos;

    if (actividadEstudiantesEl) {
      actividadEstudiantesEl.textContent = `Actualmente hay ${totalEstudiantes} estudiantes registrados en el sistema.`;
    }

    if (actividadDocentesEl) {
      actividadDocentesEl.textContent = `Actualmente hay ${totalDocentes} docentes registrados y disponibles.`;
    }

    if (actividadCursosEl) {
      actividadCursosEl.textContent = `Actualmente hay ${totalCursos} cursos activos relacionados con grupos y materias.`;
    }

    if (actividadPagosEl) {
      actividadPagosEl.textContent = `Actualmente hay ${totalPagos} pagos almacenados en el módulo financiero.`;
    }

    actualizarNotificaciones(totalEstudiantes, totalDocentes, totalCursos, totalPagos);
    crearGraficoBarras(totalEstudiantes, totalDocentes, totalCursos, totalPagos);
    crearGraficoDona(totalEstudiantes, totalDocentes, totalCursos, totalPagos);

  } catch (error) {
    console.error("Error al cargar el resumen del dashboard:", error);

    if (cantidadEstudiantesEl) cantidadEstudiantesEl.textContent = "--";
    if (cantidadEstudiantesHeroEl) cantidadEstudiantesHeroEl.textContent = "--";
    if (cantidadDocentesEl) cantidadDocentesEl.textContent = "--";
    if (cantidadCursosEl) cantidadCursosEl.textContent = "--";
    if (cantidadPagosEl) cantidadPagosEl.textContent = "--";
  }
}

function actualizarRelojYSaludo() {
  const fecha = document.getElementById("fechaDashboard");
  const saludo = document.getElementById("saludoDashboard");

  const ahora = new Date();
  const hora = ahora.getHours();

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

function crearGraficoBarras(estudiantes, docentes, cursos, pagos) {
  const canvas = document.getElementById("barChartDashboard");
  if (!canvas) return;

  if (barChartInstance) {
    barChartInstance.destroy();
  }

  barChartInstance = new Chart(canvas, {
    type: "bar",
    data: {
      labels: ["Estudiantes", "Docentes", "Cursos", "Pagos"],
      datasets: [
        {
          label: "Cantidad registrada",
          data: [estudiantes, docentes, cursos, pagos],
          backgroundColor: [
            "#1d4ed8",
            "#0ea5e9",
            "#8b5cf6",
            "#10b981"
          ],
          borderColor: [
            "#1e40af",
            "#0284c7",
            "#7c3aed",
            "#059669"
          ],
          borderWidth: 1.5,
          borderRadius: 10,
          borderSkipped: false
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            precision: 0,
            color: "#64748b"
          },
          grid: {
            color: "rgba(148, 163, 184, 0.15)"
          }
        },
        x: {
          ticks: {
            color: "#334155"
          },
          grid: {
            display: false
          }
        }
      }
    }
  });
}

function crearGraficoDona(estudiantes, docentes, cursos, pagos) {
  const canvas = document.getElementById("doughnutChartDashboard");
  if (!canvas) return;

  if (doughnutChartInstance) {
    doughnutChartInstance.destroy();
  }

  const datos = [estudiantes, docentes, cursos, pagos];
  const todosCero = datos.every(valor => valor === 0);

  doughnutChartInstance = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: ["Estudiantes", "Docentes", "Cursos", "Pagos"],
      datasets: [
        {
          data: todosCero ? [1, 1, 1, 1] : datos,
          backgroundColor: [
            "#1d4ed8",
            "#0ea5e9",
            "#8b5cf6",
            "#10b981"
          ],
          borderWidth: 0,
          hoverOffset: 8
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "65%",
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#334155",
            usePointStyle: true,
            padding: 16
          }
        }
      }
    }
  });
}

function cargarUsuarioLogueado() {
  const usuarioGuardado = localStorage.getItem("usuarioLogueado");
  const chip = document.getElementById("usuarioLogueadoChip");

  if (!chip) return;

  if (!usuarioGuardado) {
    chip.textContent = "Invitado";
    return;
  }

  try {
    const usuario = JSON.parse(usuarioGuardado);
    chip.textContent = `Bienvenido, ${usuario.nombre}`;
  } catch {
    chip.textContent = "Administrador";
  }
}

function cerrarSesion() {
  localStorage.removeItem("usuarioLogueado");
  window.location.href = "login.html";
}

function cargarUsuarioTopbar() {
  const usuarioGuardado = localStorage.getItem("usuarioLogueado");
  const topbarUserName = document.getElementById("topbarUserName");

  if (!topbarUserName) return;

  if (!usuarioGuardado) {
    topbarUserName.textContent = "Administrador";
    return;
  }

  try {
    const usuarioData = JSON.parse(usuarioGuardado);
    topbarUserName.textContent = usuarioData.nombre || "Administrador";
  } catch {
    topbarUserName.textContent = "Administrador";
  }
}

function actualizarRelojTopbar() {
  const topbarClock = document.getElementById("topbarClock");
  if (!topbarClock) return;

  const ahora = new Date();
  const hora = String(ahora.getHours()).padStart(2, "0");
  const minutos = String(ahora.getMinutes()).padStart(2, "0");

  topbarClock.textContent = `${hora}:${minutos}`;
}

function actualizarNotificaciones(estudiantes, docentes, cursos, pagos) {
  const notifEstudiantes = document.getElementById("notifEstudiantes");
  const notifDocentes = document.getElementById("notifDocentes");
  const notifCursos = document.getElementById("notifCursos");
  const notifPagos = document.getElementById("notifPagos");

  if (notifEstudiantes) {
    notifEstudiantes.textContent = `Hay ${estudiantes} estudiantes registrados actualmente.`;
  }

  if (notifDocentes) {
    notifDocentes.textContent = `Hay ${docentes} docentes disponibles en el sistema.`;
  }

  if (notifCursos) {
    notifCursos.textContent = `Hay ${cursos} cursos activos relacionados con grupos y materias.`;
  }

  if (notifPagos) {
    notifPagos.textContent = `Se registran ${pagos} pagos dentro del módulo financiero.`;
  }
}

function inicializarCampanilla() {
  const notificationBtn = document.getElementById("notificationBtn");
  const notificationDropdown = document.getElementById("notificationDropdown");
  const markReadBtn = document.getElementById("markReadBtn");
  const notifDot = document.getElementById("notifDot");

  if (!notificationBtn || !notificationDropdown) return;

  notificationBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle("hidden");
  });

  document.addEventListener("click", (e) => {
    if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
      notificationDropdown.classList.add("hidden");
    }
  });

  if (markReadBtn) {
    markReadBtn.addEventListener("click", () => {
      const unreadItems = document.querySelectorAll(".notification-item.unread");
      unreadItems.forEach(item => item.classList.remove("unread"));

      if (notifDot) {
        notifDot.style.display = "none";
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  cargarUsuarioLogueado();
  cargarUsuarioTopbar();
  cargarResumenDashboard();
  actualizarRelojYSaludo();
  actualizarRelojTopbar();
  inicializarCampanilla();

  setInterval(() => {
    actualizarRelojYSaludo();
    actualizarRelojTopbar();
  }, 1000);
});