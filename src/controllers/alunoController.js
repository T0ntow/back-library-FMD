// TypeScript (ou JS com JSDoc)
export interface UseCaseError {
    status: number;
    message: string;
    errors: {
      [field: string]: string[];
    };
}

// Função helper para criar o erro
const createUseCaseError = (status: number, message: string, fieldErrors: { [field: string]: string[] } = {}): UseCaseError => {
    return { status, message, errors: fieldErrors };
};

// Exemplo no endpoint
const novoAluno = (req, res) => {
    const { matricula, nome, cpf, data_nascimento, id_turma } = req.body;

    const checkExistingCPFQuery = 'SELECT COUNT(*) AS count FROM Aluno WHERE cpf = ?';

    connection.query(checkExistingCPFQuery, [cpf], (checkErr, checkResult) => {
        if (checkErr) {
            console.error('Erro ao verificar CPF:', checkErr);
            const error: UseCaseError = createUseCaseError(
                500,
                'Erro ao verificar CPF no banco de dados',
                { database: [checkErr.code] } // passando o código do banco no campo 'database'
            );
            return res.status(error.status).json(error);
        }

        const existingCount = checkResult[0].count;

        if (existingCount > 0) {
            const error: UseCaseError = createUseCaseError(
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

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error('Erro ao inserir dados:', err);
                const error: UseCaseError = createUseCaseError(
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
