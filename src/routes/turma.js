const express = require('express');
const router = express.Router();
const { novaTurma, listarTurmas, buscarTurmaPorId, atualizarTurma, deletarTurma } = require('../controllers/turmaController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Turma:
 *       type: object
 *       required:
 *         - curso
 *         - serie
 *         - ano_letivo
 *       properties:
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
 * /turmas/novo:
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
router.post('/turmas/novo', novaTurma);

/**
 * @swagger
 * /turmas/listar:
 *   get:
 *     summary: Lista todas as turmas
 *     tags: [Turmas]
 *     responses:
 *       200:
 *         description: Lista de turmas retornada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.get('/turmas/listar', listarTurmas);

/**
 * @swagger
 * /turmas/buscar/{id}:
 *   get:
 *     summary: Busca uma turma pelo ID
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma retornada com sucesso
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.get('/turmas/buscar/:id', buscarTurmaPorId);

/**
 * @swagger
 * /turmas/atualizar/{id}:
 *   put:
 *     summary: Atualiza uma turma
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da turma
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Turma'
 *     responses:
 *       200:
 *         description: Turma atualizada com sucesso
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.put('/turmas/atualizar/:id', atualizarTurma);

/**
 * @swagger
 * /turmas/deletar/{id}:
 *   delete:
 *     summary: Deleta uma turma
 *     tags: [Turmas]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da turma
 *     responses:
 *       200:
 *         description: Turma deletada com sucesso
 *       404:
 *         description: Turma não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.delete('/turmas/deletar/:id', deletarTurma);

module.exports = router;
