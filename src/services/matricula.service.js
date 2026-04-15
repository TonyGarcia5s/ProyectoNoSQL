const Matricula = require('../models/Matricula.model');

const matriculaService = {
  async findAll() {
    return Matricula.find();
  },
  async findById(id) {
    return Matricula.findById(id);
  },
  async create(data) {
    return Matricula.create(data);
  },
  async update(id, data) {
    return Matricula.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Matricula.findByIdAndDelete(id);
  },
};

module.exports = matriculaService;
