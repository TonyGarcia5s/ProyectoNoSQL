const { Schema, model } = require("mongoose");

const comunicadoSchema = new Schema(
  {
    IdComunicado: { type: Number, required: true, unique: true },
    Titulo: { type: String, required: true },
    Mensaje: { type: String, required: true },
    Fecha: { type: Date, required: true },
    DirigidoA: { type: String, enum: ["Todos", "Padres", "Docentes", "Estudiantes"], required: true },
    Estado: { type: String, enum: ["Publicado", "Borrador"], default: "Publicado" },
  },
  { timestamps: true, collection: "Comunicados" },
);

module.exports = model("Comunicado", comunicadoSchema);
