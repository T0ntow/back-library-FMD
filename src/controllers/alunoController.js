const { createUseCaseError } = require('../utils/useCaseError');
const connection = require('../connection');

const novoAluno = (req, res) => {
  const { matricula, nome, cpf, data_nascimento, id_turma } = req.body;

  const checkExistingCPFQuery = 'SELECT COUNT(*) AS count FROM Aluno WHERE cpf = ?';

  connection.query(checkExistingCPFQuery, [cpf], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Erro ao verificar CPF:', checkErr);
      const error = createUseCaseError(
        500,
        'Erro ao verificar CPF no banco de dados',
        { database: [checkErr.code] }
      );
      return res.status(error.status).json(error);
    }

    const existingCount = checkResult[0].count;

    if (existingCount > 0) {
      const error = createUseCaseError(
        400,
        'Já existe um aluno com este CPF',
        { cpf: ['CPF já cadastrado'] }
      );
      return res.status(error.status).json(error);
    }

    const sql = `
      INSERT INTO Aluno (matricula, nome, cpf, data_nascimento, id_turma)
      VALUES (?, ?, ?, ?, ?);
    `;
    const values = [matricula, nome, cpf, data_nascimento, id_turma];

    connection.query(sql, values, (err) => {
      if (err) {
        console.error('Erro ao inserir dados:', err);
        const error = createUseCaseError(
          500,
          'Erro ao inserir dados no banco de dados',
          { database: [err.code] }
        );
        return res.status(error.status).json(error);
      }

      res.status(201).json({ message: 'Aluno inserido com sucesso' });
    });
  });
};

module.exports = { novoAluno };
