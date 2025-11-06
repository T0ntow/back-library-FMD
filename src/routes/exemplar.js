const express = require('express');
const router = express.Router();
const { 
    novoExemplar,
    listarExemplares,
    buscarExemplarPorId,
    listarExemplaresPorLivro,
    atualizarExemplar,
    deletarExemplar
} = require('../controllers/exemplarController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Exemplar:
 *       type: object
 *       required:
 *         - estado
 *         - ano_aquisicao
 *         - ano_descarte
 *         - isbn_livro
 *       properties:
 *         estado:
 *           type: string
 *           enum: ['Novo', 'Regular', 'Danificado', 'Perdido']
 *           example: "Novo"
 *         ano_aquisicao:
 *           type: integer
 *           example: 2024
 *         ano_descarte:
 *           type: integer
 *           example: 2027
 *         isbn_livro:
 *           type: string
 *           example: "978-85-7522-123-4567"
 */

/**
 * @swagger
 * /exemplar:
 *   post:
 *     summary: Cadastra um novo exemplar
 *     tags: [Exemplares]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Exemplar'
 *     responses:
 *       201:
 *         description: Exemplar cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Exemplar inserido com sucesso"
 *                 id:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Erro de validação ou exemplar já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/exemplar', novoExemplar);

/**
 * @swagger
 * /exemplar:
 *   get:
 *     summary: Lista todos os exemplares
 *     tags: [Exemplares]
 *     responses:
 *       200:
 *         description: Lista de exemplares retornada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/exemplar', listarExemplares);

/**
 * @swagger
 * /exemplar/{id}:
 *   get:
 *     summary: Busca exemplar por ID
 *     tags: [Exemplares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do exemplar
 *     responses:
 *       200:
 *         description: Exemplar encontrado
 *       404:
 *         description: Exemplar não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/exemplar/:id', buscarExemplarPorId);

/**
 * @swagger
 * /exemplar/livro/{isbn}:
 *   get:
 *     summary: Lista exemplares de um livro específico
 *     tags: [Exemplares]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: ISBN do livro
 *     responses:
 *       200:
 *         description: Lista de exemplares retornada com sucesso
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/exemplar/livro/:isbn', listarExemplaresPorLivro);

/**
 * @swagger
 * /exemplar/{id}:
 *   put:
 *     summary: Atualiza exemplar
 *     tags: [Exemplares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do exemplar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               estado:
 *                 type: string
 *                 example: "Regular"
 *               ano_aquisicao:
 *                 type: integer
 *                 example: 2024
 *               ano_descarte:
 *                 type: integer
 *                 example: 2025
 *     responses:
 *       200:
 *         description: Exemplar atualizado com sucesso
 *       404:
 *         description: Exemplar não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/exemplar/:id', atualizarExemplar);

/**
 * @swagger
 * /exemplar/{id}:
 *   delete:
 *     summary: Deleta exemplar
 *     tags: [Exemplares]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do exemplar
 *     responses:
 *       200:
 *         description: Exemplar deletado com sucesso
 *       404:
 *         description: Exemplar não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/exemplar/:id', deletarExemplar);

module.exports = router;