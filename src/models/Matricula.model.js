const { Schema, model } = require("mongoose");

const matriculaSchema = new Schema(
  {
    IdMatricula: { type: Number, required: true, unique: true },
    IdEstudiante: { type: Number, required: true },
    Periodo: { type: String, required: true },
    Fecha: { type: Date, default: Date.now },
    Estado: { type: String, enum: ["Activa", "Retirada"], default: "Activa" },
  },
  { timestamps: true, collection: "Matriculas" },
);

module.exports = model("Matricula", matriculaSchema);
