const Curso = require("../models/Curso.model");

const cursoService = {
  async findAll() {
    return Curso.find();
  },
  async findById(id) {
    return Curso.findById(id);
  },
  async create(data) {
    return Curso.create(data);
  },
  async update(id, data) {
    return Curso.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Curso.findByIdAndDelete(id);
  },
};

module.exports = cursoService;
