const express = require('express');
const router = express.Router();
const { 
    novoBibliotecario, 
    listarBibliotecarios, 
    buscarBibliotecarioPorId, 
    atualizarBibliotecario, 
    deletarBibliotecario 
} = require('../controllers/bibliotecarioController');

/**
 * @swagger
 * components:
 *   schemas:
 *     Bibliotecario:
 *       type: object
 *       required:
 *         - cpf
 *         - nome
 *         - email
 *         - senha
 *       properties:
 *         cpf:
 *           type: string
 *           example: "12345678901"
 *         nome:
 *           type: string
 *           example: "Maria da Silva"
 *         email:
 *           type: string
 *           example: "maria.silva@escola.com"
 *         senha:
 *           type: string
 *           example: "123456"
 */

/**
 * @swagger
 * /bibliotecarios/novo:
 *   post:
 *     summary: Cadastra um novo bibliotecário
 *     tags: [Bibliotecarios]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bibliotecario'
 *     responses:
 *       201:
 *         description: Bibliotecário cadastrado com sucesso
 *       400:
 *         description: Já existe um bibliotecário com este CPF ou e-mail
 *       500:
 *         description: Erro no servidor
 */
router.post('/bibliotecarios/novo', novoBibliotecario);

/**
 * @swagger
 * /bibliotecarios/listar:
 *   get:
 *     summary: Lista todos os bibliotecários
 *     tags: [Bibliotecarios]
 *     responses:
 *       200:
 *         description: Lista de bibliotecários retornada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.get('/bibliotecarios/listar', listarBibliotecarios);

/**
 * @swagger
 * /bibliotecarios/buscar/{id}:
 *   get:
 *     summary: Busca um bibliotecário pelo ID
 *     tags: [Bibliotecarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do bibliotecário
 *     responses:
 *       200:
 *         description: Bibliotecário retornado com sucesso
 *       404:
 *         description: Bibliotecário não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.get('/bibliotecarios/buscar/:id', buscarBibliotecarioPorId);

/**
 * @swagger
 * /bibliotecarios/atualizar/{id}:
 *   put:
 *     summary: Atualiza um bibliotecário
 *     tags: [Bibliotecarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do bibliotecário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bibliotecario'
 *     responses:
 *       200:
 *         description: Bibliotecário atualizado com sucesso
 *       404:
 *         description: Bibliotecário não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.put('/bibliotecarios/atualizar/:id', atualizarBibliotecario);

/**
 * @swagger
 * /bibliotecarios/deletar/{id}:
 *   delete:
 *     summary: Deleta um bibliotecário
 *     tags: [Bibliotecarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID do bibliotecário
 *     responses:
 *       200:
 *         description: Bibliotecário deletado com sucesso
 *       404:
 *         description: Bibliotecário não encontrado
 *       500:
 *         description: Erro no servidor
 */
router.delete('/bibliotecarios/deletar/:id', deletarBibliotecario);

module.exports = router;
