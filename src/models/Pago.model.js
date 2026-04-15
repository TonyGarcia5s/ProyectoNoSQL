const { Schema, model } = require("mongoose");

const pagoSchema = new Schema(
  {
    IdPago: { type: Number, required: true, unique: true },
    IdEstudiante: { type: Number, required: true },
    Concepto: { type: String, required: true },
    Monto: { type: Number, required: true, min: 0 },
    Fecha: { type: Date, default: Date.now },
    Estado: { type: String, enum: ["Pagado", "Pendiente"], default: "Pendiente" },
  },
  { timestamps: true, collection: "Pagos" },
);

module.exports = model("Pago", pagoSchema);
