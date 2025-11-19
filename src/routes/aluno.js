const express = require('express');
const router = express.Router();
const {
  novoAluno,
  listarAlunos,
  buscarAlunoPorMatricula,
  atualizarAluno,
  deletarAluno,
  uploadXlsx
} = require('../controllers/alunoController');
const upload = require('../utils/multer');

/**
 * @swagger
 * /alunos/upload:
 *   post:
 *     summary: Importa alunos via arquivo .xlsx
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Arquivo XLSX contendo os alunos
 *     responses:
 *       200:
 *         description: Arquivo importado com sucesso
 *       400:
 *         description: Nenhum arquivo enviado ou inválido
 *       500:
 *         description: Erro no servidor
 */
router.post('/alunos/upload', upload.single('file'), uploadXlsx);


/**
 * @swagger
 * components:
 *   schemas:
 *     Aluno:
 *       type: object
 *       required:
 *         - matricula
 *         - nome
 *         - cpf
 *         - data_nascimento
 *         - id_turma
 *       properties:
 *         matricula:
 *           type: string
 *           example: "202211190011"
 *         nome:
 *           type: string
 *           example: "Maria Silva"
 *         cpf:
 *           type: string
 *           example: "12345678901"
 *         data_nascimento:
 *           type: string
 *           format: date
 *           example: "2005-07-15"
 *         id_turma:
 *           type: integer
 *           example: 3
 */

/**
 * @swagger
 * /alunos/novo:
 *   post:
 *     summary: Cadastra um novo aluno
 *     tags: [Alunos]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       201:
 *         description: Aluno cadastrado com sucesso
 *       400:
 *         description: CPF já existe
 *       500:
 *         description: Erro no servidor
 */
router.post('/alunos/novo', novoAluno);

/**
 * @swagger
 * /alunos/listar:
 *   get:
 *     summary: Lista todos os alunos
 *     tags: [Alunos]
 *     responses:
 *       200:
 *         description: Lista de alunos retornada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.get('/alunos/listar', listarAlunos);

/**
 * @swagger
 * /alunos/buscar/{matricula}:
 *   get:
 *     summary: Busca um aluno pela matrícula
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: matricula
 *         schema:
 *           type: string
 *         required: true
 *         description: Matrícula do aluno
 *     responses:
 *       200:
 *         description: Aluno retornado com sucesso
 *       404:
 *         description: Aluno não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/alunos/buscar/:matricula', buscarAlunoPorMatricula);

/**
 * @swagger
 * /alunos/atualizar/{matricula}:
 *   put:
 *     summary: Atualiza um aluno
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: matricula
 *         schema:
 *           type: string
 *         required: true
 *         description: Matrícula do aluno
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Aluno'
 *     responses:
 *       200:
 *         description: Aluno atualizado com sucesso
 *       404:
 *         description: Aluno não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/alunos/atualizar/:matricula', atualizarAluno);

/**
 * @swagger
 * /alunos/deletar/{matricula}:
 *   delete:
 *     summary: Deleta um aluno
 *     tags: [Alunos]
 *     parameters:
 *       - in: path
 *         name: matricula
 *         schema:
 *           type: string
 *         required: true
 *         description: Matrícula do aluno
 *     responses:
 *       200:
 *         description: Aluno deletado com sucesso
 *       404:
 *         description: Aluno não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/alunos/deletar/:matricula', deletarAluno);

module.exports = router;
