const { Schema, model } = require("mongoose");

const materiaSchema = new Schema(
  {
    IdMateria: { type: Number, required: true, unique: true },
    Nombre: { type: String, required: true },
    Descripcion: { type: String },
    Estado: { type: String, enum: ["Activa", "Inactiva"], default: "Activa" },
  },
  { timestamps: true, collection: "Materias" },
);

module.exports = model("Materia", materiaSchema);
