const { Schema, model } = require("mongoose");

const estudianteSchema = new Schema(
  {
    IdEstudiante: { type: Number, required: true, unique: true },
    Nombre: { type: String, required: true },
    FechaNacimiento: { type: Date, required: true },
    Genero: { type: String, enum: ["M", "F"] },
    IdGrupo: { type: Number },
    Estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true, collection: "Estudiantes" },
);

module.exports = model("Estudiante", estudianteSchema);
