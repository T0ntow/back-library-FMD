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
 *           example: "978-85-7522-123-4"
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
 * /livro:
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
 *                   example: "978-85-7522-123-4"
 *       400:
 *         description: Erro de validação ou livro já existe
 *       500:
 *         description: Erro interno do servidor
 */
router.post('/livro', novoLivro);

/**
 * @swagger
 * /livro:
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
router.get('/livro', listarLivros);

/**
 * @swagger
 * /livro/{isbn}:
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
router.get('/livro/:isbn', buscarLivroPorIsbn);

/**
 * @swagger
 * /livro/{isbn}:
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
router.put('/livro/:isbn', atualizarLivro);

/**
 * @swagger
 * /livro/{isbn}:
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
router.delete('/livro/:isbn', deletarLivro);

module.exports = router;