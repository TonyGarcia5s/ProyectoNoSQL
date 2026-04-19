const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensajeLogin");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const correo = document.getElementById("correo").value.trim();
  const password = document.getElementById("password").value.trim();

  mensaje.textContent = "";

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ correo, password })
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      mensaje.textContent = data.mensaje || "Error al iniciar sesión";
      return;
    }

    localStorage.setItem("usuarioLogueado", JSON.stringify(data.usuario));
    window.location.href = "index.html";
  } catch (error) {
    console.error(error);
    mensaje.textContent = "No se pudo conectar con el servidor";
  }
});