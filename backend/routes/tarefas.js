const express = require('express');
const router = express.Router();
const Tarefa = require('../models/Tarefa');

// Rota para criar uma nova tarefa (POST)
router.post('/', async (req, res) => {
  const { nome, prioridade } = req.body;

  try {
    const novaTarefa = new Tarefa({ nome, prioridade });
    const tarefaSalva = await novaTarefa.save();
    res.status(201).json(tarefaSalva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para listar todas as tarefas (GET)
router.get('/', async (req, res) => {
  try {
    const tarefas = await Tarefa.find();
    res.status(200).json(tarefas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Rota para atualizar uma tarefa (PUT)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, prioridade } = req.body;

  try {
    const tarefaAtualizada = await Tarefa.findByIdAndUpdate(
      id,
      { nome, prioridade },
      { new: true }
    );
    res.status(200).json(tarefaAtualizada);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Rota para deletar uma tarefa (DELETE)
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await Tarefa.findByIdAndDelete(id);
    res.status(200).json({ message: 'Tarefa deletada com sucesso' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
