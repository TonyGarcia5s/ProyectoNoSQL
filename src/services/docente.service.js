const Docente = require('../models/Docente.model');

const docenteService = {
  async findAll() {
    return Docente.find();
  },
  async findById(id) {
    return Docente.findById(id);
  },
  async create(data) {
    return Docente.create(data);
  },
  async update(id, data) {
    return Docente.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Docente.findByIdAndDelete(id);
  },
};

module.exports = docenteService;
