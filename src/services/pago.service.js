const Pago = require('../models/Pago.model');

const pagoService = {
  async findAll() {
    return Pago.find();
  },
  async findById(id) {
    return Pago.findById(id);
  },
  async create(data) {
    return Pago.create(data);
  },
  async update(id, data) {
    return Pago.findByIdAndUpdate(id, data, { new: true });
  },
  async delete(id) {
    return Pago.findByIdAndDelete(id);
  },
};

module.exports = pagoService;
