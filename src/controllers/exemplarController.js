const { createUseCaseError } = require('../utils/useCaseError');
const connection = require('../connection');

// CREATE - Criar novo exemplar
const novoExemplar = (req, res) => {
    const { estado, ano_aquisicao, ano_descarte, isbn_livro } = req.body;

    // Verificar se o livro (ISBN) existe antes de inserir exemplar
    const checkLivroQuery = `
        SELECT COUNT(*) AS count 
        FROM Livro 
        WHERE isbn = ?
    `;

    connection.query(checkLivroQuery, [isbn_livro], (checkLivroErr, checkLivroResult) => {
        if (checkLivroErr) {
            console.error('Erro ao verificar o livro no banco de dados:', checkLivroErr);
            const error = createUseCaseError(
                500,
                'Erro ao verificar livro no banco de dados',
                { database: [checkLivroErr.code] }
            );
            return res.status(error.status).json(error);
        }

        const livroExists = checkLivroResult[0].count > 0;

        if (!livroExists) {
            const error = createUseCaseError(
                400,
                'Livro com este ISBN não existe',
                { isbn_livro: ['ISBN não encontrado na base de dados'] }
            );
            return res.status(error.status).json(error);
        }

        // Inserir novo exemplar (ID é auto_increment)
        const sql = `
            INSERT INTO Exemplar (estado, ano_aquisicao, ano_descarte, isbn_livro) 
            VALUES (?, ?, ?, ?)
        `;

        const values = [estado, ano_aquisicao, ano_descarte, isbn_livro];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Erro completo ao inserir exemplar:', {
                    code: err.code,
                    errno: err.errno,
                    sqlMessage: err.sqlMessage,
                    sqlState: err.sqlState
                });
                
                // Tratar especificamente erro de entrada duplicada
                if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                    let fieldName = 'id';
                    let message = 'Já existe um exemplar com este ID';
                    
                    if (err.sqlMessage && err.sqlMessage.includes('PRIMARY')) {
                        fieldName = 'id';
                        message = 'Já existe um exemplar com este ID';
                    } else if (err.sqlMessage && err.sqlMessage.includes('isbn_livro')) {
                        fieldName = 'isbn_livro';
                        message = 'Problema com o ISBN do livro informado';
                    }
                    
                    const error = createUseCaseError(
                        400,
                        message,
                        { [fieldName]: [fieldName.toUpperCase() + ' já cadastrado no sistema'] }
                    );
                    return res.status(error.status).json(error);
                }
                
                // Outros erros de banco
                const error = createUseCaseError(
                    500,
                    'Erro ao inserir exemplar no banco de dados',
                    { database: [err.code || err.errno] }
                );
                return res.status(error.status).json(error);
            }

            res.status(201).json({ 
                message: 'Exemplar inserido com sucesso', 
                id: result.insertId 
            });
        });
    });
};

// READ - Listar todos os exemplares
const listarExemplares = (req, res) => {
    const sql = `
        SELECT 
            e.*,
            l.nome as nome_livro,
            l.autor,
            CASE
            WHEN e.estado IN ('Danificado', 'Perdido')
                OR YEAR(CURDATE()) > e.ano_descarte
            THEN 'Indisponível'
            WHEN EXISTS (
                SELECT 1 
                FROM Locacao 
                WHERE id_exemplar = e.id 
                    AND status = 'Aberto'
            )
            THEN 'Emprestado'
            ELSE 'Disponível'
            END as disponibilidade
        FROM Exemplar e
        INNER JOIN Livro l ON e.isbn_livro = l.isbn
        ORDER BY e.id;
    `;

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao listar exemplares:', err);
            const error = createUseCaseError(
                500,
                'Erro ao buscar exemplares no banco de dados',
                { database: [err.code] }
            );
            return res.status(error.status).json(error);
        }

        res.status(200).json(results);
    });
};

// READ - Buscar exemplar por ID
const buscarExemplarPorId = (req, res) => {
    const { id } = req.params;

    const sql = `
        SELECT e.*, l.nome as nome_livro, l.autor, l.editora
        FROM Exemplar e
        INNER JOIN Livro l ON e.isbn_livro = l.isbn
        WHERE e.id = ?
    `;

    connection.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Erro ao buscar exemplar:', err);
            const error = createUseCaseError(
                500,
                'Erro ao buscar exemplar no banco de dados',
                { database: [err.code] }
            );
            return res.status(error.status).json(error);
        }

        if (results.length === 0) {
            const error = createUseCaseError(
                404,
                'Exemplar não encontrado',
                { id: ['ID não encontrado na base de dados'] }
            );
            return res.status(error.status).json(error);
        }

        res.status(200).json(results[0]);
    });
};

// READ - Listar exemplares de um livro específico
const listarExemplaresPorLivro = (req, res) => {
    const { isbn } = req.params;

    const sql = `
        SELECT e.*, l.nome as nome_livro, l.autor
        FROM Exemplar e
        INNER JOIN Livro l ON e.isbn_livro = l.isbn
        WHERE e.isbn_livro = ?
        ORDER BY e.id
    `;

    connection.query(sql, [isbn], (err, results) => {
        if (err) {
            console.error('Erro ao buscar exemplares do livro:', err);
            const error = createUseCaseError(
                500,
                'Erro ao buscar exemplares no banco de dados',
                { database: [err.code] }
            );
            return res.status(error.status).json(error);
        }

        res.status(200).json(results);
    });
};

// UPDATE - Atualizar exemplar por ID
const atualizarExemplar = (req, res) => {
    const { id } = req.params;
    const { estado, ano_aquisicao, ano_descarte } = req.body;

    const sql = `
        UPDATE Exemplar 
        SET estado = ?, ano_aquisicao = ?, ano_descarte = ?
        WHERE id = ?
    `;

    const values = [estado, ano_aquisicao, ano_descarte, id];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar exemplar:', err);
            const error = createUseCaseError(
                500,
                'Erro ao atualizar exemplar no banco de dados',
                { database: [err.code] }
            );
            return res.status(error.status).json(error);
        }

        if (result.affectedRows === 0) {
            const error = createUseCaseError(
                404,
                'Exemplar não encontrado',
                { id: ['ID não encontrado na base de dados'] }
            );
            return res.status(error.status).json(error);
        }

        res.status(200).json({ message: 'Exemplar atualizado com sucesso', id: parseInt(id) });
    });
};

// DELETE - Deletar exemplar por ID
const deletarExemplar = (req, res) => {
    const { id } = req.params;

    const sql = 'DELETE FROM Exemplar WHERE id = ?';

    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Erro ao deletar exemplar:', err);
            const error = createUseCaseError(
                500,
                'Erro ao deletar exemplar no banco de dados',
                { database: [err.code] }
            );
            return res.status(error.status).json(error);
        }

        if (result.affectedRows === 0) {
            const error = createUseCaseError(
                404,
                'Exemplar não encontrado',
                { id: ['ID não encontrado na base de dados'] }
            );
            return res.status(error.status).json(error);
        }

        res.status(200).json({ message: 'Exemplar deletado com sucesso' });
    });
};

module.exports = { 
    novoExemplar,
    listarExemplares,
    buscarExemplarPorId,
    listarExemplaresPorLivro,
    atualizarExemplar,
    deletarExemplar
};