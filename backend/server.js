import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Conectar ao MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conectado ao MongoDB'))
    .catch(err => console.error('Erro ao conectar ao MongoDB:', err));

// Definição do modelo de Tarefa
const Tarefa = mongoose.model('Tarefa', new mongoose.Schema({
    nome: { type: String, required: true },
    data: { type: String, required: true },
    prioridade: { type: String, required: true }
}));

// Rota para adicionar uma tarefa
app.post('/tarefas', async (req, res) => {
    try {
        const tarefa = new Tarefa(req.body);
        await tarefa.save();
        res.status(201).json(tarefa);
    } catch (error) {
        res.status(400).json({ message: 'Erro ao adicionar tarefa', error });
    }
});

// Rota para listar as tarefas
app.get('/tarefas', async (req, res) => {
    const tarefas = await Tarefa.find();
    res.json(tarefas);
});

// Rota para deletar uma tarefa
app.delete('/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Requisição de deleção recebida para a tarefa com ID: ${id}`);
    try {
        const tarefaDeletada = await Tarefa.findByIdAndDelete(id);
        if (!tarefaDeletada) {
            console.log(`Tarefa não encontrada para o ID: ${id}`);
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }
        console.log(`Tarefa deletada: ${tarefaDeletada}`);
        res.status(200).json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
        console.error(`Erro ao deletar tarefa: ${error.message}`);
        res.status(500).json({ message: 'Erro ao deletar tarefa', error });
    }
});

// Configurar o servidor para ouvir na porta definida
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
