const { createUseCaseError } = require('../utils/useCaseError');
const connection = require('../connection');

const novaLocacao = (req, res) => {
    const { id_bibliotecario, matricula_aluno, id_exemplar, data_emprestimo, data_prevista, status, descricao } = req.body;

    const sql = `
        INSERT INTO Locacao (id_bibliotecario, matricula_aluno, id_exemplar, data_emprestimo, data_prevista, status, descricao)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [id_bibliotecario, matricula_aluno, id_exemplar, data_emprestimo, data_prevista, status, descricao];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao inserir locação:', err);
            const error = createUseCaseError(500, 'Erro ao inserir locação no banco de dados', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        res.status(201).json({ message: 'Locação registrada com sucesso', id: result.insertId });
    });
};

const listarLocacoes = (req, res) => {
    const sql = `
        SELECT L.*, A.nome AS aluno, B.nome AS bibliotecario, E.id AS exemplar
        FROM Locacao L
        JOIN Aluno A ON L.matricula_aluno = A.matricula
        JOIN Bibliotecario B ON L.id_bibliotecario = B.id
        JOIN Exemplar E ON L.id_exemplar = E.id
    `;
    connection.query(sql, (err, result) => {
        if (err) {
            const error = createUseCaseError(500, 'Erro ao buscar locações', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        res.status(200).json(result);
    });
};

const buscarLocacaoPorId = (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT Lc.*, A.nome as nome_aluno, L.nome as nome_livro, L.isbn as isbn_livro, E.estado as estado_exemplar
        FROM Locacao Lc
        JOIN Aluno A ON Lc.matricula_aluno = A.matricula
        JOIN EXEMPLAR E ON Lc.id_exemplar = E.id
        JOIN Livro L ON E.isbn_livro = L.isbn
        WHERE Lc.id = ?
    `;

    connection.query(sql, [id], (err, result) => {
        if (err) {
            const error = createUseCaseError(500, 'Erro ao buscar locação', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        if (result.length === 0) {
            const error = createUseCaseError(404, 'Locação não encontrada');
            return res.status(error.status).json(error);
        }
        res.status(200).json(result[0]);
    });
};

const atualizarLocacao = (req, res) => {
    const { id } = req.params;
    const { data_devolucao, status, descricao } = req.body;

    const sql = `
        UPDATE Locacao
        SET data_devolucao = ?, status = ?, descricao = ?
        WHERE id = ?
    `;
    connection.query(sql, [data_devolucao, status, descricao, id], (err, result) => {
        if (err) {
            const error = createUseCaseError(500, 'Erro ao atualizar locação', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        if (result.affectedRows === 0) {
            const error = createUseCaseError(404, 'Locação não encontrada');
            return res.status(error.status).json(error);
        }
        res.status(200).json({ message: 'Locação atualizada com sucesso' });
    });
};

const deletarLocacao = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Locacao WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            const error = createUseCaseError(500, 'Erro ao deletar locação', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        if (result.affectedRows === 0) {
            const error = createUseCaseError(404, 'Locação não encontrada');
            return res.status(error.status).json(error);
        }
        res.status(200).json({ message: 'Locação deletada com sucesso' });
    });
};

module.exports = {
    novaLocacao,
    listarLocacoes,
    buscarLocacaoPorId,
    atualizarLocacao,
    deletarLocacao
};
