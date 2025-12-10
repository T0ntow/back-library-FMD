const { createUseCaseError } = require('../utils/useCaseError');
const connection = require('../connection');
const XLSX = require('xlsx');

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
  const sql = `
    SELECT A.*, T.curso as curso_turma, T.ano_letivo as ano_letivo_turma, T.serie as serie_turma
    FROM Aluno A
    JOIN Turma T ON T.id = A.id_turma
    WHERE matricula = ?
  `;
  const sqlLocacoes = `
    SELECT Lc.*, A.nome AS nome_aluno, L.nome AS nome_livro, L.isbn AS isbn_livro
    FROM Locacao Lc
    JOIN Aluno A ON Lc.matricula_aluno = A.matricula
    JOIN Exemplar E ON Lc.id_exemplar = E.id
    JOIN Livro L ON E.isbn_livro = L.isbn
    WHERE Lc.matricula_aluno = ?
  `;

  connection.query(sql, [matricula], (err, result) => {
    if (err) {
      console.error("Erro ao buscar aluno:", err);
      const error = createUseCaseError(
        500,
        "Erro ao buscar aluno no banco de dados",
        { database: [err.code] }
      );
      return res.status(error.status).json(error);
    }
    if (result.length === 0) {
      const error = createUseCaseError(404, "Aluno não encontrado");
      return res.status(error.status).json(error);
    }

    const aluno = result[0];

    connection.query(
      sqlLocacoes,
      [matricula],
      (errLocacoes, locacoesResult) => {
        if (errLocacoes) {
          const error = createUseCaseError(500, "Erro ao buscar locações", {
            database: [errLocacoes.code],
          });
          return res.status(error.status).json(error);
        }

        aluno.locacoes = locacoesResult;

        res.status(200).json(aluno);
      }
    );
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

const uploadXlsx = (req, res) => {
  try {
    if (!req.file) {
      const error = createUseCaseError(
        400,
        "Nenhum arquivo enviado",
        { file: ["Envie um arquivo .xlsx válido"] }
      );
      return res.status(error.status).json(error);
    }

    const workbook = XLSX.read(req.file.buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];

    const sheet = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    if (sheet.length <= 1) {
      return res.status(400).json({
        message: "Arquivo vazio",
        errors: { file: ["A planilha não possui linhas"] }
      });
    }

    // Usa a segunda linha como header
    const header = sheet[1];

    // Mapeia linhas → objetos
    const rows = sheet.slice(1).map((row) => {
      const obj = {};
      header.forEach((colName, i) => {
        obj[colName] = row[i];
      });
      return obj;
    });

    // Normalizador
    const normalize = (str) =>
      str
        ?.toString()
        ?.normalize("NFD")
        ?.replace(/[\u0300-\u036f]/g, "")
        ?.toLowerCase()
        ?.trim();

    // Normaliza todas as cidades
    rows.forEach((a) => {
      if (a["Cidade"]) {
        a["Cidade"] = normalize(a["Cidade"]);
      }
    });

    // Filtra apenas Vitória da Conquista
    const alunosFiltrados = rows.filter(
      (a) => a["Cidade"] === "vitoria da conquista"
    );

    if (alunosFiltrados.length === 0) {
      return res.status(400).json({
        status: 400,
        message: "Nenhum aluno encontrado para 'Vitoria da Conquista'",
        errors: { filtro: ["A planilha não contém alunos dessa cidade"] }
      });
    }

    // Monta valores para o INSERT
    const valores = alunosFiltrados.map((a, idx) => {
      const rawDate = a["Data de Nascimento"];

      const parsedDate = parseExcelDateCell(rawDate);
      const sqlDate = toSqlDateString(parsedDate);

      // LOGS para depuração (mostra só 10)
      if (idx < 10) {
        console.log(
          `Data linha ${idx}: raw='${rawDate}' | parsed=${parsedDate} | sql='${sqlDate}'`
        );
      }

      return [
        String(a["Matrícula"] || ""),
        a["Nome"] || "",
        sqlDate,
        a["Curso"] || "",
        a["Ano de Ingresso"] || null,
        "vitoria da conquista",
        a["Cor/Raça"] || "",
        a["Sexo"] || ""
      ];
    });
  
    // Funciona como um UPSERT -> Insere ou atuliza com base na PK
    const sql = `
      INSERT INTO aluno_import
      (matricula, nome, data_nascimento, curso, ano_ingresso, cidade, cor_raca, sexo)
      VALUES ?
      ON DUPLICATE KEY UPDATE
        nome = VALUES(nome),
        data_nascimento = VALUES(data_nascimento),
        curso = VALUES(curso),
        ano_ingresso = VALUES(ano_ingresso),
        cidade = VALUES(cidade),
        cor_raca = VALUES(cor_raca),
        sexo = VALUES(sexo)
    `;


    connection.query(sql, [valores], (err) => {
      if (err) {
        console.error("Erro ao inserir dados:", err);
        return res.status(500).json({
          message: "Erro ao inserir dados no banco de dados",
          errors: { database: [err.code] }
        });
      }

      res.status(200).json({
        message: "Arquivo importado com sucesso",
        total_importados: valores.length
      });
    });

  } catch (error) {
    console.error("Erro inesperado:", error);
    return res.status(500).json({ message: "Erro interno ao processar o arquivo" });
  }
};

// 🔵 Converte valor de célula em objeto Date ou null
function parseExcelDateCell(value) {
  if (value == null || value === "") return null;

  // Já é Date válido
  if (value instanceof Date && !isNaN(value)) {
    return value;
  }

  // Valor numérico = serial do Excel
  if (typeof value === "number") {
    const d = XLSX.SSF.parse_date_code(value);
    if (!d) return null;
    return new Date(d.y, d.m - 1, d.d, d.H || 0, d.M || 0, d.S || 0);
  }

  // Valor string
  if (typeof value === "string") {
    const s = value.trim();

    // dd/mm/yyyy ou dd-mm-yyyy
    const regexDMY = /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/;
    const dmy = s.match(regexDMY);

    if (dmy) {
      let day = parseInt(dmy[1], 10);
      let month = parseInt(dmy[2], 10);
      let year = parseInt(dmy[3], 10);

      if (year < 100) year += 2000; // proteger datas com ano curto

      return new Date(year, month - 1, day);
    }

    // yyyy-mm-dd (ISO)
    const parsedIso = new Date(s);
    if (!isNaN(parsedIso)) {
      return parsedIso;
    }

    // Serial vindo como string "44831"
    const asNumber = Number(s);
    if (!isNaN(asNumber)) {
      const d = XLSX.SSF.parse_date_code(asNumber);
      if (d) return new Date(d.y, d.m - 1, d.d);
    }
  }

  return null;
}

// 🔵 Converte para 'YYYY-MM-DD' ou null
function toSqlDateString(dateObj) {
  if (!dateObj) return null;
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
  const dd = String(dateObj.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

module.exports = { novoAluno, listarAlunos, buscarAlunoPorMatricula, atualizarAluno, deletarAluno, uploadXlsx };
