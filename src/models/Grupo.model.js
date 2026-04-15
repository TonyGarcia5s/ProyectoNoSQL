const { Schema, model } = require("mongoose");

const grupoSchema = new Schema(
  {
    IdGrupo: { type: Number, required: true, unique: true },
    Nombre: { type: String, required: true },
    Nivel: { type: String, required: true },
    Seccion: { type: String, required: true },
    Estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true, collection: "Grupos" },
);

module.exports = model("Grupos", grupoSchema);
