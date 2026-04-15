const { Schema, model } = require("mongoose");

const docenteSchema = new Schema(
  {
    IdDocente: { type: Number, required: true, unique: true },
    Nombre: { type: String, required: true },
    Especialidad: { type: String },
    Telefono: { type: String },
    Correo: { type: String },
    Estado: { type: String, enum: ["Activo", "Inactivo"], default: "Activo" },
  },
  { timestamps: true, collection: "Docentes" },
);

module.exports = model("Docente", docenteSchema);
