const { Schema, model } = require("mongoose");

const cursoSchema = new Schema(
  {
    IdCurso: { type: Number, required: true, unique: true },
    Nombre: { type: String, required: true },
    IdMateria: { type: Number, required: true },
    IdDocente: { type: Number, required: true },
    IdGrupo: { type: Number, required: true },
    Estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true, collection: "Cursos" },
);

module.exports = model("Curso", cursoSchema);
