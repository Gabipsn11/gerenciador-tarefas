const mongoose = require('mongoose');

const tarefaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  data: {
    type: Date,
    default: Date.now,
  },
  prioridade: {
    type: String,
    enum: ['Baixa', 'Média', 'Alta'],
    default: 'Média',
  },
});

module.exports = mongoose.model('Tarefa', tarefaSchema);
