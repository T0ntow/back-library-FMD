const connection = require('../connection');
const { createUseCaseError } = require('../utils/useCaseError');

// Resumo geral para cards da dashboard
const getResumoDashboard = (req, res) => {
  const sql = `
    SELECT
      (SELECT COUNT(*) FROM Aluno) AS alunos,
      (SELECT COUNT(*) FROM Livro) AS livros,
      (SELECT COUNT(*) FROM Exemplar) AS exemplares,
      (SELECT COUNT(*) FROM Turma) AS turmas,
      (SELECT COUNT(*) FROM Locacao WHERE status = 'Aberto') AS locacoes_ativas,
      (SELECT COUNT(*) FROM Locacao WHERE status = 'Aberto' AND data_prevista < CURDATE()) AS locacoes_atraso
  `;

  connection.query(sql, (err, rows) => {
    if (err) {
      const error = createUseCaseError(
        500,
        'Erro ao carregar resumo da dashboard',
        { database: [err.code] }
      );
      return res.status(error.status).json(error);
    }
    res.json(rows[0]);
  });
};

// Top livros mais emprestados
const getLivrosMaisEmprestados = (req, res) => {
  const limit = Number(req.query.limit) || 5;
  const sql = `
    SELECT l.isbn, l.nome, l.autor, COUNT(*) AS emprestimos
    FROM Locacao lc
    JOIN Exemplar e ON lc.id_exemplar = e.id
    JOIN Livro l ON e.isbn_livro = l.isbn
    GROUP BY l.isbn
    ORDER BY emprestimos DESC
    LIMIT ?
  `;

  connection.query(sql, [limit], (err, rows) => {
    if (err) {
      const error = createUseCaseError(
        500,
        'Erro ao listar livros mais emprestados',
        { database: [err.code] }
      );
      return res.status(error.status).json(error);
    }
    res.json(rows);
  });
};

// Locações em atraso
const getLocacoesAtraso = (req, res) => {
  const sql = `
    SELECT lc.id, a.nome AS aluno, l.nome AS livro, lc.data_prevista,
           DATEDIFF(CURDATE(), lc.data_prevista) AS dias_atraso
    FROM Locacao lc
    JOIN Aluno a ON lc.matricula_aluno = a.matricula
    JOIN Exemplar e ON lc.id_exemplar = e.id
    JOIN Livro l ON e.isbn_livro = l.isbn
    WHERE lc.status = 'Aberto' AND lc.data_prevista < CURDATE()
    ORDER BY lc.data_prevista ASC
  `;

  connection.query(sql, (err, rows) => {
    if (err) {
      const error = createUseCaseError(
        500,
        'Erro ao listar locações em atraso',
        { database: [err.code] }
      );
      return res.status(error.status).json(error);
    }
    res.json(rows);
  });
};

// Locações por mês (para gráficos)
const getLocacoesPorMes = (req, res) => {
  const ano = Number(req.query.ano) || new Date().getFullYear();

  const sql = `
    SELECT
      DATE_FORMAT(data_emprestimo, '%Y-%m') AS mes,
      COUNT(*) AS total
    FROM Locacao
    WHERE data_emprestimo IS NOT NULL
      AND YEAR(data_emprestimo) = ?
    GROUP BY mes
    ORDER BY mes
  `;

  connection.query(sql, [ano], (err, rows) => {
    if (err) {
      const error = createUseCaseError(
        500,
        'Erro ao listar locações por mês',
        { database: [err.code] }
      );
      return res.status(error.status).json(error);
    }
    res.json({ ano, meses: rows });
  });
};

// Disponibilidade de exemplares (disponíveis, emprestados, indisponíveis)
const getExemplaresDisponibilidade = (req, res) => {
  const sql = `
    SELECT
      SUM(CASE WHEN e.estado IN ('Novo','Regular') AND lc.id IS NULL THEN 1 ELSE 0 END) AS disponiveis,
      SUM(CASE WHEN lc.status = 'Aberto' THEN 1 ELSE 0 END) AS emprestados,
      SUM(CASE WHEN e.estado IN ('Danificado','Perdido') THEN 1 ELSE 0 END) AS indisponiveis
    FROM Exemplar e
    LEFT JOIN Locacao lc ON lc.id_exemplar = e.id AND lc.status = 'Aberto'
  `;

  connection.query(sql, (err, rows) => {
    if (err) {
      const error = createUseCaseError(
        500,
        'Erro ao calcular disponibilidade de exemplares',
        { database: [err.code] }
      );
      return res.status(error.status).json(error);
    }
    res.json(rows[0]);
  });
};

module.exports = {
  getResumoDashboard,
  getLivrosMaisEmprestados,
  getLocacoesAtraso,
  getLocacoesPorMes,
  getExemplaresDisponibilidade,
};

