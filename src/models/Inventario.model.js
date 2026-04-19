const { Schema, model } = require("mongoose");

const inventarioSchema = new Schema(
  {
    IdInventario: { type: Number, required: true, unique: true },
    Articulo: { type: String, required: true },
    Descripcion: { type: String },
    Cantidad: { type: Number, required: true, min: 0 },
    Precio: { type: Number, required: true, min: 0 },
    Estado: { type: String, enum: ["Disponible", "Agotado"], default: "Disponible" },
  },
  { timestamps: true, collection: "Inventario" },
);

module.exports = model("Inventario", inventarioSchema);
