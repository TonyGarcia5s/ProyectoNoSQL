const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema(
  {
    IdUsuario: {
      type: Number,
      required: true,
      unique: true
    },
    Nombre: {
      type: String,
      required: true,
      trim: true
    },
    Correo: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    Password: {
      type: String,
      required: true
    },
    Estado: {
      type: String,
      enum: ["Activo", "Inactivo"],
      default: "Activo"
    },
    IdRol: {
      type: Number,
      required: true
    }
  },
  {
    collection: "Usuarios",
    versionKey: false
  }
);

module.exports = mongoose.model("Usuario", usuarioSchema);