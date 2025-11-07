const express = require('express');
const router = express.Router();
const { 
    novoLivro,
    listarLivros,
    buscarLivroPorIsbn,
    atualizarLivro,
    deletarLivro
} = require('../controllers/livroController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Livro:
 *       type: object
 *       required:
 *         - isbn
 *         - nome
 *         - autor
 *         - editora
 *         - disciplina
 *         - serie
 *         - ano_publicacao
 *         - edicao
 *       properties:
 *         isbn:
 *           type: string
 *           example: "9788575221234"
 *         nome:
 *           type: string
 *           example: "Matemática Básica"
 *         autor:
 *           type: string
 *           example: "João Silva"
 *         editora:
 *           type: string
 *           example: "Editora Educacional"
 *         disciplina:
 *           type: string
 *           example: "Matemática"
 *         serie:
 *           type: string
 *           enum: ['1º Ano', '2º Ano', '3º Ano']
 *           example: "1º Ano"
 *         ano_publicacao:
 *           type: integer
 *           example: 2023
 *         edicao:
 *           type: string
 *           example: "5ª Edição"
 */

/**
 * @swagger
 * /livros/novo:
 *   post:
 *     summary: Cadastra um novo livro
 *     tags: [Livros]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Livro'
 *     responses:
 *       201:
 *         description: Livro cadastrado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Livro inserido com sucesso"
 *                 isbn:
 *                   type: string
 *                   example: "9788575221234"
 *       400:
 *         description: Erro de validação ou livro já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/livros/novo', novoLivro);

/**
 * @swagger
 * /livros/listar:
 *   get:
 *     summary: Lista todos os livros
 *     tags: [Livros]
 *     responses:
 *       200:
 *         description: Lista de livros
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Livro'
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/livros/listar', listarLivros);

/**
 * @swagger
 * /livros/buscar/{isbn}:
 *   get:
 *     summary: Busca um livro pelo ISBN
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: ISBN do livro
 *     responses:
 *       200:
 *         description: Livro encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Livro'
 *       404:
 *         description: Livro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get('/livros/buscar/:isbn', buscarLivroPorIsbn);

/**
 * @swagger
 * /livros/atualizar/{isbn}:
 *   put:
 *     summary: Atualiza um livro pelo ISBN
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: ISBN do livro
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               autor:
 *                 type: string
 *               editora:
 *                 type: string
 *               disciplina:
 *                 type: string
 *               serie:
 *                 type: string
 *               ano_publicacao:
 *                 type: integer
 *               edicao:
 *                 type: string
 *     responses:
 *       200:
 *         description: Livro atualizado com sucesso
 *       404:
 *         description: Livro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.put('/livros/atualizar/:isbn', atualizarLivro);

/**
 * @swagger
 * /livros/deletar/{isbn}:
 *   delete:
 *     summary: Deleta um livro pelo ISBN
 *     tags: [Livros]
 *     parameters:
 *       - in: path
 *         name: isbn
 *         required: true
 *         schema:
 *           type: string
 *         description: ISBN do livro
 *     responses:
 *       200:
 *         description: Livro deletado com sucesso
 *       400:
 *         description: Livro possui exemplares vinculados
 *       404:
 *         description: Livro não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.delete('/livros/deletar/:isbn', deletarLivro);

module.exports = router;