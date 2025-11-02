const connection = require('../connection');

const novaTurma = (req, res) => {
    const { curso, serie, ano_letivo } = req.body;

    // Verificar se a turma já existe --exatamente igual--
    const checkExistingTurmaQuery = `
        SELECT COUNT(*) AS count 
        FROM Turma 
        WHERE curso = ? AND serie = ? AND ano_letivo = ?
    `;

    connection.query(checkExistingTurmaQuery, [curso, serie, ano_letivo], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Erro ao verificar a turma no banco de dados:', checkErr);
            res.status(500).json({ error: 'Erro ao verificar a turma no banco de dados' });
            return;
        }

        const existingCount = checkResult[0].count;

        if (existingCount > 0) {
            res.status(400).json({ error: 'Já existe uma turma com este curso, série e ano letivo' });
            return;
        }

        // Inserir nova turma
        const sql = `
            INSERT INTO Turma (curso, serie, ano_letivo) 
            VALUES (?, ?, ?)
        `;

        const values = [id, curso, serie, ano_letivo];

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Erro ao inserir turma no banco de dados:', err);
                res.status(500).json({ error: 'Erro ao inserir turma no banco de dados' });
                return;
            }

            console.log('Turma inserida com sucesso no banco de dados');
            res.status(201).json({ message: 'Turma inserida com sucesso', id: result.insertId });
        });
    });
};

module.exports = { novaTurma };
