const express = require('express');
const router = express.Router();
const { novaTurma } = require('../controllers/turmaController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Turma:
 *       type: object
 *       required:
 *         - id
 *         - curso
 *         - serie
 *         - ano_letivo
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         curso:
 *           type: string
 *           example: "Informática"
 *         serie:
 *           type: string
 *           enum: ['1º Ano', '2º Ano', '3º Ano']
 *           example: "2º Ano"
 *         ano_letivo:
 *           type: integer
 *           example: 2025
 */

/**
 * @swagger
 * /turmas:
 *   post:
 *     summary: Cadastra uma nova turma
 *     tags: [Turmas]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turma'
 *     responses:
 *       201:
 *         description: Turma cadastrada com sucesso
 *       400:
 *         description: Turma já existe
 *       500:
 *         description: Erro no servidor
 */
router.post('/turmas', novaTurma);

module.exports = router;
