const { Schema, model } = require("mongoose");

const asistenciaSchema = new Schema(
  {
    IdAsistencia: { type: Number, required: true, unique: true },
    IdEstudiante: { type: Number, required: true },
    Fecha: { type: Date, required: true },
    Estado: {
      type: String,
      enum: ["Presente", "Ausente", "Tardía"],
      required: true,
    },
    Observacion: { type: String, default: "" },
  },
  { timestamps: true, collection: "Asistencia" },
);

module.exports = model("Asistencia", asistenciaSchema);
