const { Schema, model } = require("mongoose");

const notaSchema = new Schema(
  {
    IdNota: { type: Number, required: true, unique: true },
    IdEstudiante: { type: Number, required: true },
    IdCurso: { type: Number, required: true },
    Periodo: { type: Number, required: true, min: 1 },
    Nota: { type: Number, required: true, min: 0, max: 100 },
    Estado: { type: String, enum: ["Registrada", "Revisada"], default: "Registrada" },
  },
  { timestamps: true, collection: "Notas" },
);

module.exports = model("Nota", notaSchema);
