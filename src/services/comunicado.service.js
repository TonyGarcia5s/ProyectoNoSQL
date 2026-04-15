const Comunicado = require('../models/Comunicado.model');

const comunicadoService = {
  async findAll() {
    return Comunicado.find();
  },
  async findById(id) {
    return Comunicado.findById(id);
  },
  async create(data) {
    return Comunicado.create(data);
  },
  async update(id, data) {
    return Comunicado.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Comunicado.findByIdAndDelete(id);
  },
};

module.exports = comunicadoService;
