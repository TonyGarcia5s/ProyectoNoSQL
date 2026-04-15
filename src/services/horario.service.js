const Horario = require('../models/Horario.model');

const horarioService = {
  async findAll() {
    return Horario.find();
  },
  async findById(id) {
    return Horario.findById(id);
  },
  async create(data) {
    return Horario.create(data);
  },
  async update(id, data) {
    return Horario.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Horario.findByIdAndDelete(id);
  },
};

module.exports = horarioService;
