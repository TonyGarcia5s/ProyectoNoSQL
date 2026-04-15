const Padre = require('../models/Padre.model');

const padreService = {
  async findAll() {
    return Padre.find();
  },
  async findById(id) {
    return Padre.findById(id);
  },
  async create(data) {
    return Padre.create(data);
  },
  async update(id, data) {
    return Padre.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Padre.findByIdAndDelete(id);
  },
};

module.exports = padreService;
