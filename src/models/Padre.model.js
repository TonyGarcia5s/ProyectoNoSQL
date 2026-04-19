const { Schema, model } = require("mongoose");

const padreSchema = new Schema(
  {
    IdPadre: { type: Number, required: true, unique: true },
    Nombre: { type: String, required: true },
    Telefono: { type: String },
    Correo: { type: String },
    Direccion: { type: String },
    Estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true, collection: "Padres" },
);

module.exports = model("Padre", padreSchema);
