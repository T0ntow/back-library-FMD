const express = require('express');
const router = express.Router();
const { novoAluno } = require('../controllers/alunoController');

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
 * /alunos:
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
router.post('/alunos', novoAluno);

module.exports = router;
