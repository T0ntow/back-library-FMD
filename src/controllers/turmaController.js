const { createUseCaseError } = require('../utils/useCaseError');
const connection = require('../connection');

const novaTurma = (req, res) => {
    const { curso, serie, ano_letivo } = req.body;

    const checkExistingTurmaQuery = `
        SELECT COUNT(*) AS count
        FROM Turma
        WHERE curso = ? AND serie = ? AND ano_letivo = ?
    `;

    connection.query(checkExistingTurmaQuery, [curso, serie, ano_letivo], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Erro ao verificar a turma:', checkErr);
            const error = createUseCaseError(500, 'Erro ao verificar a turma no banco de dados', { database: [checkErr.code] });
            return res.status(error.status).json(error);
        }

        const existingCount = checkResult[0].count;

        if (existingCount > 0) {
            const error = createUseCaseError(400, 'Já existe uma turma com este curso, série e ano letivo');
            return res.status(error.status).json(error);
        }

        const sql = `
            INSERT INTO Turma (curso, serie, ano_letivo)
            VALUES (?, ?, ?)
        `;

        const values = [curso, serie, ano_letivo];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Erro ao inserir turma:', err);
                const error = createUseCaseError(500, 'Erro ao inserir turma no banco de dados', { database: [err.code] });
                return res.status(error.status).json(error);
            }
            res.status(201).json({ message: 'Turma inserida com sucesso', id: result.insertId });
        });
    });
};

const listarTurmas = (req, res) => {
    const sql = 'SELECT * FROM Turma';

    connection.query(sql, (err, result) => {
        if (err) {
            console.error('Erro ao buscar turmas:', err);
            const error = createUseCaseError(500, 'Erro ao buscar turmas no banco de dados', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        res.status(200).json(result);
    });
};

const buscarTurmaPorId = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM Turma WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao buscar turma:', err);
            const error = createUseCaseError(500, 'Erro ao buscar turma no banco de dados', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        if (result.length === 0) {
            const error = createUseCaseError(404, 'Turma não encontrada');
            return res.status(error.status).json(error);
        }
        res.status(200).json(result[0]);
    });
};

const atualizarTurma = (req, res) => {
    const { id } = req.params;
    const { curso, serie, ano_letivo } = req.body;

    const sql = `
        UPDATE Turma
        SET curso = ?, serie = ?, ano_letivo = ?
        WHERE id = ?;
    `;
    const values = [curso, serie, ano_letivo, id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar turma:', err);
            const error = createUseCaseError(500, 'Erro ao atualizar turma no banco de dados', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        if (result.affectedRows === 0) {
            const error = createUseCaseError(404, 'Turma não encontrada');
            return res.status(error.status).json(error);
        }
        res.status(200).json({ message: 'Turma atualizada com sucesso' });
    });
};

const deletarTurma = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Turma WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar turma:', err);
            const error = createUseCaseError(500, 'Erro ao deletar turma no banco de dados', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        if (result.affectedRows === 0) {
            const error = createUseCaseError(404, 'Turma não encontrada');
            return res.status(error.status).json(error);
        }
        res.status(200).json({ message: 'Turma deletada com sucesso' });
    });
};

module.exports = { novaTurma, listarTurmas, buscarTurmaPorId, atualizarTurma, deletarTurma };
