const { Schema, model } = require("mongoose");

const horarioSchema = new Schema(
  {
    IdHorario: { type: Number, required: true, unique: true },
    IdCurso: { type: Number, required: true },
    IdAula: { type: Number, required: true },
    Dia: { type: String, enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"], required: true },
    HoraInicio: { type: String, required: true },
    HoraFin: { type: String, required: true },
  },
  { timestamps: true, collection: "Horarios" },
);

module.exports = model("Horario", horarioSchema);
