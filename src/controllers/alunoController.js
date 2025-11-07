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

const listarAlunos = (req, res) => {
  const sql = 'SELECT * FROM Aluno';

  connection.query(sql, (err, result) => {
    if (err) {
      console.error('Erro ao buscar alunos:', err);
      const error = createUseCaseError(500, 'Erro ao buscar alunos no banco de dados', { database: [err.code] });
      return res.status(error.status).json(error);
    }
    res.status(200).json(result);
  });
};

const buscarAlunoPorMatricula = (req, res) => {
  const { matricula } = req.params;
  const sql = 'SELECT * FROM Aluno WHERE matricula = ?';

  connection.query(sql, [matricula], (err, result) => {
    if (err) {
      console.error('Erro ao buscar aluno:', err);
      const error = createUseCaseError(500, 'Erro ao buscar aluno no banco de dados', { database: [err.code] });
      return res.status(error.status).json(error);
    }
    if (result.length === 0) {
      const error = createUseCaseError(404, 'Aluno não encontrado');
      return res.status(error.status).json(error);
    }
    res.status(200).json(result[0]);
  });
};

const atualizarAluno = (req, res) => {
  const { matricula } = req.params;
  const { nome, cpf, data_nascimento, id_turma } = req.body;

  const sql = `
    UPDATE Aluno
    SET nome = ?, cpf = ?, data_nascimento = ?, id_turma = ?
    WHERE matricula = ?;
  `;
  const values = [nome, cpf, data_nascimento, id_turma, matricula];

  connection.query(sql, values, (err, result) => {
    if (err) {
      console.error('Erro ao atualizar aluno:', err);
      const error = createUseCaseError(500, 'Erro ao atualizar aluno no banco de dados', { database: [err.code] });
      return res.status(error.status).json(error);
    }
    if (result.affectedRows === 0) {
      const error = createUseCaseError(404, 'Aluno não encontrado');
      return res.status(error.status).json(error);
    }
    res.status(200).json({ message: 'Aluno atualizado com sucesso' });
  });
};

const deletarAluno = (req, res) => {
  const { matricula } = req.params;
  const sql = 'DELETE FROM Aluno WHERE matricula = ?';

  connection.query(sql, [matricula], (err, result) => {
    if (err) {
      console.error('Erro ao deletar aluno:', err);
      const error = createUseCaseError(500, 'Erro ao deletar aluno no banco de dados', { database: [err.code] });
      return res.status(error.status).json(error);
    }
    if (result.affectedRows === 0) {
      const error = createUseCaseError(404, 'Aluno não encontrado');
      return res.status(error.status).json(error);
    }
    res.status(200).json({ message: 'Aluno deletado com sucesso' });
  });
};


module.exports = { novoAluno, listarAlunos, buscarAlunoPorMatricula, atualizarAluno, deletarAluno };
