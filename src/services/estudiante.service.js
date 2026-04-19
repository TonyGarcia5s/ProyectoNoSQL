const Estudiante = require("../models/Estudiante.model");

const estudianteService = {
  async findAll() {
    return Estudiante.find();
  },
  async findById(id) {
    return Estudiante.findById(id);
  },
  async create(data) {
    return Estudiante.create(data);
  },
  async update(id, data) {
    return Estudiante.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Estudiante.findByIdAndDelete(id);
  },
};

module.exports = estudianteService;
