const Usuario = require("../models/usuario.model");

exports.login = async (req, res) => {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        ok: false,
        mensaje: "Correo y contraseña son obligatorios"
      });
    }

    const usuario = await Usuario.findOne({
      Correo: correo,
      Estado: "Activo"
    });

    if (!usuario) {
      return res.status(401).json({
        ok: false,
        mensaje: "Usuario no encontrado o inactivo"
      });
    }

    if (usuario.Password !== password) {
      return res.status(401).json({
        ok: false,
        mensaje: "Contraseña incorrecta"
      });
    }

    return res.json({
      ok: true,
      mensaje: "Login correcto",
      usuario: {
        id: usuario.IdUsuario,
        nombre: usuario.Nombre,
        correo: usuario.Correo,
        rol: usuario.IdRol
      }
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      mensaje: "Error en el servidor",
      error: error.message
    });
  }
};