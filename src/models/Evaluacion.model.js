const { Schema, model } = require("mongoose");

const evaluacionSchema = new Schema(
  {
    IdEvaluacion: { type: Number, required: true, unique: true },
    IdCurso: { type: Number, required: true },
    Nombre: { type: String, required: true },
    Porcentaje: { type: Number, required: true, min: 0, max: 100 },
    Fecha: { type: Date, required: true },
    Estado: { type: String, enum: ["Aplicada", "Pendiente"], default: "Pendiente" },
  },
  { timestamps: true, collection: "Evaluaciones" },
);

module.exports = model("Evaluacion", evaluacionSchema);
