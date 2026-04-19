const Asistencia = require("../models/Asistencia.model");

const asistenciaService = {
  async findAll() {
    return Asistencia.find();
  },
  async findById(id) {
    return Asistencia.findById(id);
  },
  async create(data) {
    return Asistencia.create(data);
  },
  async update(id, data) {
    return Asistencia.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Asistencia.findByIdAndDelete(id);
  },
};

module.exports = asistenciaService;
