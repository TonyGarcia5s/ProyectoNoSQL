const Nota = require("../models/Nota.model");

const notaService = {
  async findAll() {
    return Nota.find();
  },
  async findById(id) {
    return Nota.findById(id);
  },
  async create(data) {
    return Nota.create(data);
  },
  async update(id, data) {
    return Nota.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Nota.findByIdAndDelete(id);
  },
};

module.exports = notaService;
