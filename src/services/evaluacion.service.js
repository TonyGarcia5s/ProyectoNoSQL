const Evaluacion = require('../models/Evaluacion.model');

const evaluacionService = {
  async findAll() {
    return Evaluacion.find();
  },
  async findById(id) {
    return Evaluacion.findById(id);
  },
  async create(data) {
    return Evaluacion.create(data);
  },
  async update(id, data) {
    return Evaluacion.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Evaluacion.findByIdAndDelete(id);
  },
};

module.exports = evaluacionService;
