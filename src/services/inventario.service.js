const Inventario = require('../models/Inventario.model');

const inventarioService = {
  async findAll() {
    return Inventario.find();
  },
  async findById(id) {
    return Inventario.findById(id);
  },
  async create(data) {
    return Inventario.create(data);
  },
  async update(id, data) {
    return Inventario.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Inventario.findByIdAndDelete(id);
  },
};

module.exports = inventarioService;
