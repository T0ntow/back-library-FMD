const { createUseCaseError } = require('../utils/useCaseError');
const connection = require('../connection');

const novoBibliotecario = (req, res) => {
    const { cpf, nome, email, senha } = req.body;

    const checkExistingQuery = `
        SELECT COUNT(*) AS count
        FROM Bibliotecario
        WHERE cpf = ? OR email = ?
    `;

    connection.query(checkExistingQuery, [cpf, email], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Erro ao verificar bibliotecário:', checkErr);
            const error = createUseCaseError(500, 'Erro ao verificar bibliotecário no banco de dados', { database: [checkErr.code] });
            return res.status(error.status).json(error);
        }

        if (checkResult[0].count > 0) {
            const error = createUseCaseError(400, 'Já existe um bibliotecário com este CPF ou e-mail');
            return res.status(error.status).json(error);
        }

        const sql = `
            INSERT INTO Bibliotecario (cpf, nome, email, senha)
            VALUES (?, ?, ?, ?)
        `;
        connection.query(sql, [cpf, nome, email, senha], (err, result) => {
            if (err) {
                console.error('Erro ao inserir bibliotecário:', err);
                const error = createUseCaseError(500, 'Erro ao inserir bibliotecário no banco de dados', { database: [err.code] });
                return res.status(error.status).json(error);
            }
            res.status(201).json({ message: 'Bibliotecário cadastrado com sucesso', id: result.insertId });
        });
    });
};

const listarBibliotecarios = (req, res) => {
    const sql = 'SELECT * FROM Bibliotecario';
    connection.query(sql, (err, result) => {
        if (err) {
            const error = createUseCaseError(500, 'Erro ao buscar bibliotecários', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        res.status(200).json(result);
    });
};

const buscarBibliotecarioPorId = (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM Bibliotecario WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            const error = createUseCaseError(500, 'Erro ao buscar bibliotecário', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        if (result.length === 0) {
            const error = createUseCaseError(404, 'Bibliotecário não encontrado');
            return res.status(error.status).json(error);
        }
        res.status(200).json(result[0]);
    });
};

const atualizarBibliotecario = (req, res) => {
    const { id } = req.params;
    const { cpf, nome, email, senha } = req.body;

    const sql = `
        UPDATE Bibliotecario
        SET cpf = ?, nome = ?, email = ?, senha = ?
        WHERE id = ?
    `;
    connection.query(sql, [cpf, nome, email, senha, id], (err, result) => {
        if (err) {
            const error = createUseCaseError(500, 'Erro ao atualizar bibliotecário', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        if (result.affectedRows === 0) {
            const error = createUseCaseError(404, 'Bibliotecário não encontrado');
            return res.status(error.status).json(error);
        }
        res.status(200).json({ message: 'Bibliotecário atualizado com sucesso' });
    });
};

const deletarBibliotecario = (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM Bibliotecario WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            const error = createUseCaseError(500, 'Erro ao deletar bibliotecário', { database: [err.code] });
            return res.status(error.status).json(error);
        }
        if (result.affectedRows === 0) {
            const error = createUseCaseError(404, 'Bibliotecário não encontrado');
            return res.status(error.status).json(error);
        }
        res.status(200).json({ message: 'Bibliotecário deletado com sucesso' });
    });
};

module.exports = {
    novoBibliotecario,
    listarBibliotecarios,
    buscarBibliotecarioPorId,
    atualizarBibliotecario,
    deletarBibliotecario
};
