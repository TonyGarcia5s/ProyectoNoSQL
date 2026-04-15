const pagoService = require('../services/pago.service');

const pagoController = {
  async findAll(req, res) {
    try {
      const data = await pagoService.findAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async findById(req, res) {
    try {
      const data = await pagoService.findById(req.params.id);
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async create(req, res) {
    try {
      const data = await pagoService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async update(req, res) {
    try {
      const data = await pagoService.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async delete(req, res) {
    try {
      const data = await pagoService.delete(req.params.id);
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = pagoController;
