const express = require('express');
const router = express.Router();
const { 
    novaLocacao, 
    listarLocacoes, 
    buscarLocacaoPorId, 
    atualizarLocacao, 
    deletarLocacao 
} = require('../controllers/locacaoController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Locacao:
 *       type: object
 *       required:
 *         - id_bibliotecario
 *         - matricula_aluno
 *         - id_exemplar
 *         - data_emprestimo
 *         - data_prevista
 *         - status
 *       properties:
 *         id_bibliotecario:
 *           type: integer
 *           example: 1
 *         matricula_aluno:
 *           type: string
 *           example: "20230012"
 *         id_exemplar:
 *           type: integer
 *           example: 4
 *         data_emprestimo:
 *           type: string
 *           format: date
 *           example: "2025-11-10"
 *         data_prevista:
 *           type: string
 *           format: date
 *           example: "2025-11-20"
 *         data_devolucao:
 *           type: string
 *           format: date
 *           example: "2025-11-18"
 *         status:
 *           type: string
 *           enum: ['Aberto', 'Finalizado']
 *           example: "Aberto"
 *         descricao:
 *           type: string
 *           example: "Livro devolvido em boas condições"
 */

/**
 * @swagger
 * /locacoes/novo:
 *   post:
 *     summary: Registra uma nova locação
 *     tags: [Locacoes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Locacao'
 *     responses:
 *       201:
 *         description: Locação registrada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.post('/locacoes/novo', novaLocacao);

/**
 * @swagger
 * /locacoes/listar:
 *   get:
 *     summary: Lista todas as locações
 *     tags: [Locacoes]
 *     responses:
 *       200:
 *         description: Lista de locações retornada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.get('/locacoes/listar', listarLocacoes);

/**
 * @swagger
 * /locacoes/buscar/{id}:
 *   get:
 *     summary: Busca uma locação pelo ID
 *     tags: [Locacoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da locação
 *     responses:
 *       200:
 *         description: Locação retornada com sucesso
 *       404:
 *         description: Locação não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.get('/locacoes/buscar/:id', buscarLocacaoPorId);

/**
 * @swagger
 * /locacoes/atualizar/{id}:
 *   put:
 *     summary: Atualiza uma locação existente (devolução, status, descrição)
 *     tags: [Locacoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da locação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data_devolucao:
 *                 type: string
 *                 format: date
 *               status:
 *                 type: string
 *                 enum: ['Aberto', 'Finalizado']
 *               descricao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Locação atualizada com sucesso
 *       404:
 *         description: Locação não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.put('/locacoes/atualizar/:id', atualizarLocacao);

/**
 * @swagger
 * /locacoes/deletar/{id}:
 *   delete:
 *     summary: Deleta uma locação
 *     tags: [Locacoes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID da locação
 *     responses:
 *       200:
 *         description: Locação deletada com sucesso
 *       404:
 *         description: Locação não encontrada
 *       500:
 *         description: Erro no servidor
 */
router.delete('/locacoes/deletar/:id', deletarLocacao);

module.exports = router;
