const { Schema, model } = require("mongoose");

const aulaSchema = new Schema(
  {
    IdAula: { type: Number, required: true, unique: true },
    NombreAula: { type: String, required: true },
    Capacidad: { type: Number, required: true, min: 1 },
    Ubicacion: { type: String },
    Estado: { type: String, enum: ["Disponible", "No disponible"], default: "Disponible" },
  },
  { timestamps: true, collection: "Aulas" },
);

module.exports = model("Aulas", aulaSchema);
