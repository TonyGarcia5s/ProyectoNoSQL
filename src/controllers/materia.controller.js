const materiaService = require('../services/materia.service');

const materiaController = {
  async findAll(req, res) {
    try {
      const data = await materiaService.findAll();
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async findById(req, res) {
    try {
      const data = await materiaService.findById(req.params.id);
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async create(req, res) {
    try {
      const data = await materiaService.create(req.body);
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async update(req, res) {
    try {
      const data = await materiaService.update(req.params.id, req.body);
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
  async delete(req, res) {
    try {
      const data = await materiaService.delete(req.params.id);
      if (!data) return res.status(404).json({ error: 'Not found' });
      res.json({ message: 'Deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = materiaController;
