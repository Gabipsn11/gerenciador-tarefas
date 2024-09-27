const form = document.getElementById("tarefa-form");
const tarefaInput = document.getElementById("tarefa-nome"); // Atualizado para o ID correto
const dataInput = document.getElementById("data"); // Mantido
const prioridadeInput = document.getElementById("tarefa-prioridade"); // Campo de prioridade
const tarefasList = document.getElementById("tarefas-list");
const mensagem = document.getElementById("mensagem");

let tarefas = [];

// Função para carregar tarefas do backend
const carregarTarefas = async () => {
    try {
        const response = await fetch('http://localhost:3001/tarefas');
        if (!response.ok) throw new Error('Erro ao carregar tarefas');

        tarefas = await response.json();
        atualizarListaTarefas();
    } catch (error) {
        console.error('Erro ao carregar tarefas:', error);
    }
};

// Função para adicionar tarefa
const adicionarTarefa = async (e) => {
    e.preventDefault();

    const tarefa = {
        nome: tarefaInput.value,
        data: dataInput.value, // Captura a data do novo campo
        prioridade: prioridadeInput.value // Captura a prioridade
    };

    try {
        const response = await fetch('http://localhost:3001/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tarefa)
        });

        if (!response.ok) throw new Error('Erro ao adicionar tarefa');

        const novaTarefa = await response.json();
        tarefas.push(novaTarefa);
        tarefaInput.value = '';
        dataInput.value = ''; // Limpa o campo de data
        prioridadeInput.value = ''; // Limpa o campo de prioridade
        exibirMensagem('Tarefa adicionada com sucesso!');

        atualizarListaTarefas();
    } catch (error) {
        console.error('Erro ao adicionar tarefa:', error);
        exibirMensagem('Erro ao adicionar tarefa');
    }
};

// Função para atualizar a lista de tarefas
const atualizarListaTarefas = () => {
    tarefasList.innerHTML = '';

    tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.textContent = `${tarefa.nome} - ${tarefa.data} - Prioridade: ${tarefa.prioridade}`; // Mostra a prioridade junto com o nome

        const botaoDeletar = document.createElement('button');
        botaoDeletar.textContent = 'Deletar';
        botaoDeletar.onclick = () => deletarTarefa(tarefa._id);

        li.appendChild(botaoDeletar);
        tarefasList.appendChild(li);
    });
};

// Função para deletar tarefa
const deletarTarefa = async (id) => {
    try {
        const response = await fetch(`http://localhost:3001/tarefas/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Erro ao deletar tarefa');

        tarefas = tarefas.filter(tarefa => tarefa._id !== id);
        atualizarListaTarefas();
        exibirMensagem('Tarefa deletada com sucesso!');
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        exibirMensagem('Erro ao deletar tarefa');
    }
};

// Função para exibir mensagem
const exibirMensagem = (mensagemTexto) => {
    mensagem.textContent = mensagemTexto;
    setTimeout(() => {
        mensagem.textContent = '';
    }, 3000);
};

// Event listener para o formulário
form.addEventListener("submit", adicionarTarefa);

// Carregar tarefas ao iniciar
carregarTarefas();
