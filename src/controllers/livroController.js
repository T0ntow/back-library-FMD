const { createUseCaseError } = require('../utils/useCaseError');
const connection = require('../connection');

// CREATE - Criar novo livro
const novoLivro = (req, res) => {
    const { isbn, nome, autor, editora, disciplina, serie, ano_publicacao, edicao } = req.body;
    const isbnNumerico = isbn.replace(/\D/g, '');

    // Inserir novo livro direto (o banco detecta duplicação)
    const sql = `
        INSERT INTO Livro (isbn, nome, autor, editora, disciplina, serie, ano_publicacao, edicao) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [isbnNumerico, nome, autor, editora, disciplina, serie, ano_publicacao, edicao];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro completo ao inserir livro:', {
                code: err.code,
                errno: err.errno,
                sqlMessage: err.sqlMessage,
                sqlState: err.sqlState
            });
            
            // Tratar especificamente erro de entrada duplicada
            if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                let fieldName = 'isbn';
                let message = 'Já existe um livro com este ISBN';
                
                if (err.sqlMessage && err.sqlMessage.includes('isbn')) {
                    fieldName = 'isbn';
                    message = 'Já existe um livro com este ISBN';
                } else if (err.sqlMessage && err.sqlMessage.includes('nome')) {
                    fieldName = 'nome';
                    message = 'Já existe um livro com este nome';
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
                'Erro ao inserir livro no banco de dados',
                { database: [err.code || err.errno] }
            );
            return res.status(error.status).json(error);
        }

        res.status(201).json({ message: 'Livro inserido com sucesso', isbn: isbnNumerico });
    });
};

// READ - Listar todos os livros
const listarLivros = (req, res) => {
    const sql = 'SELECT * FROM Livro ORDER BY nome';

    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Erro ao listar livros:', err);
            const error = createUseCaseError(
                500,
                'Erro ao buscar livros no banco de dados',
                { database: [err.code] }
            );
            return res.status(error.status).json(error);
        }

        res.status(200).json(results);
    });
};

// READ - Buscar livro por ISBN
const buscarLivroPorIsbn = (req, res) => {
    const { isbn } = req.params;
    const isbnNumerico = isbn.replace(/\D/g, '');

    const sql = 'SELECT * FROM Livro WHERE isbn = ?';

    connection.query(sql, [isbnNumerico], (err, results) => {
        if (err) {
            console.error('Erro ao buscar livro:', err);
            const error = createUseCaseError(
                500,
                'Erro ao buscar livro no banco de dados',
                { database: [err.code] }
            );
            return res.status(error.status).json(error);
        }

        if (results.length === 0) {
            const error = createUseCaseError(
                404,
                'Livro não encontrado',
                { isbn: ['ISBN não encontrado na base de dados'] }
            );
            return res.status(error.status).json(error);
        }

        res.status(200).json(results[0]);
    });
};

// UPDATE - Atualizar livro por ISBN
const atualizarLivro = (req, res) => {
    const { isbn } = req.params;
    const isbnNumerico = isbn.replace(/\D/g, '');
    const { nome, autor, editora, disciplina, serie, ano_publicacao, edicao } = req.body;

    const sql = `
        UPDATE Livro 
        SET nome = ?, autor = ?, editora = ?, disciplina = ?, serie = ?, ano_publicacao = ?, edicao = ?
        WHERE isbn = ?
    `;

    const values = [nome, autor, editora, disciplina, serie, ano_publicacao, edicao, isbnNumerico];

    connection.query(sql, values, (err, result) => {
        if (err) {
            console.error('Erro ao atualizar livro:', err);
            const error = createUseCaseError(
                500,
                'Erro ao atualizar livro no banco de dados',
                { database: [err.code] }
            );
            return res.status(error.status).json(error);
        }

        if (result.affectedRows === 0) {
            const error = createUseCaseError(
                404,
                'Livro não encontrado',
                { isbn: ['ISBN não encontrado na base de dados'] }
            );
            return res.status(error.status).json(error);
        }

        res.status(200).json({ message: 'Livro atualizado com sucesso', isbn: isbnNumerico });
    });
};

// DELETE - Deletar livro por ISBN
const deletarLivro = (req, res) => {
    const { isbn } = req.params;
    const isbnNumerico = isbn.replace(/\D/g, '');

    // Verificar se existem exemplares deste livro
    const checkExemplaresQuery = 'SELECT COUNT(*) AS count FROM Exemplar WHERE isbn_livro = ?';

    connection.query(checkExemplaresQuery, [isbnNumerico], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Erro ao verificar exemplares:', checkErr);
            const error = createUseCaseError(
                500,
                'Erro ao verificar exemplares no banco de dados',
                { database: [checkErr.code] }
            );
            return res.status(error.status).json(error);
        }

        const exemplarCount = checkResult[0].count;

        if (exemplarCount > 0) {
            const error = createUseCaseError(
                400,
                `Não é possível deletar o livro. Existem ${exemplarCount} exemplar(es) vinculado(s)`,
                { isbn: ['Livro possui exemplares vinculados'] }
            );
            return res.status(error.status).json(error);
        }

        // Deletar o livro
        const sql = 'DELETE FROM Livro WHERE isbn = ?';

        connection.query(sql, [isbnNumerico], (err, result) => {
            if (err) {
                console.error('Erro ao deletar livro:', err);
                const error = createUseCaseError(
                    500,
                    'Erro ao deletar livro no banco de dados',
                    { database: [err.code] }
                );
                return res.status(error.status).json(error);
            }

            if (result.affectedRows === 0) {
                const error = createUseCaseError(
                    404,
                    'Livro não encontrado',
                    { isbn: ['ISBN não encontrado na base de dados'] }
                );
                return res.status(error.status).json(error);
            }

            res.status(200).json({ message: 'Livro deletado com sucesso' });
        });
    });
};

module.exports = { 
    novoLivro,
    listarLivros,
    buscarLivroPorIsbn,
    atualizarLivro,
    deletarLivro
};