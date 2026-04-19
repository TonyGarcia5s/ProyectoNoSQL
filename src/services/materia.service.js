const Materia = require('../models/Materia.model');

const materiaService = {
  async findAll() {
    return Materia.find();
  },
  async findById(id) {
    return Materia.findById(id);
  },
  async create(data) {
    return Materia.create(data);
  },
  async update(id, data) {
    return Materia.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Materia.findByIdAndDelete(id);
  },
};

module.exports = materiaService;
