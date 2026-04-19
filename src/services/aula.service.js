const Aula = require('../models/Aula.model');

const aulaService = {
  async findAll() {
    return Aula.find();
  },
  async findById(id) {
    return Aula.findById(id);
  },
  async create(data) {
    return Aula.create(data);
  },
  async update(id, data) {
    return Aula.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Aula.findByIdAndDelete(id);
  },
};

module.exports = aulaService;
