const Grupo = require('../models/Grupo.model');

const grupoService = {
  async findAll() {
    return Grupo.find();
  },
  async findById(id) {
    return Grupo.findById(id);
  },
  async create(data) {
    return Grupo.create(data);
  },
  async update(id, data) {
    return Grupo.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Grupo.findByIdAndDelete(id);
  },
};

module.exports = grupoService;
