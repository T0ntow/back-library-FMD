const connection = require('../connection');

const novoAluno = (req, res) => {
    const { matricula, nome, cpf, data_nascimento, id_turma } = req.body;

    // Verificar se o CPF já está cadastrado
    const checkExistingCPFQuery = 'SELECT COUNT(*) AS count FROM Aluno WHERE cpf = ?';

    connection.query(checkExistingCPFQuery, [cpf], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Erro ao verificar CPF no banco de dados:', checkErr);
            res.status(500).json({ error: 'Erro ao verificar CPF no banco de dados' });
            return;
        }

        const existingCount = checkResult[0].count;

        if (existingCount > 0) {
            // Já existe um aluno com este CPF
            res.status(400).json({ error: 'Já existe um aluno com este CPF' });
            return;
        }

        // Se o CPF não existe, insere o aluno
        const sql = `
            INSERT INTO Aluno (matricula, nome, cpf, data_nascimento, id_turma) 
            VALUES (?, ?, ?, ?, ?);
        `;

        const values = [matricula, nome, cpf, data_nascimento, id_turma];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Erro ao inserir dados no banco de dados:', err);
                res.status(500).json({ error: 'Erro ao inserir dados no banco de dados' });
                return;
            }

            console.log('Aluno inserido com sucesso no banco de dados');
            res.status(201).json({ message: 'Aluno inserido com sucesso' });
        });
    });
};

module.exports = { novoAluno };
