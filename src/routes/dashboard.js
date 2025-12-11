const express = require('express');
const router = express.Router();
const {
  getResumoDashboard,
  getLivrosMaisEmprestados,
  getLocacoesAtraso,
  getLocacoesPorMes,
  getExemplaresDisponibilidade,
} = require('../controllers/dashboardController');

/**
 * @swagger
 * /dashboard/resumo:
 *   get:
 *     summary: Retorna contadores gerais para a dashboard
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Resumo retornado com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.get('/dashboard/resumo', getResumoDashboard);

/**
 * @swagger
 * /dashboard/livros-mais-emprestados:
 *   get:
 *     summary: Lista os livros mais emprestados
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Quantidade de livros a retornar (default 5)
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.get('/dashboard/livros-mais-emprestados', getLivrosMaisEmprestados);

/**
 * @swagger
 * /dashboard/locacoes-atraso:
 *   get:
 *     summary: Lista locações em atraso
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.get('/dashboard/locacoes-atraso', getLocacoesAtraso);

/**
 * @swagger
 * /dashboard/locacoes-por-mes:
 *   get:
 *     summary: Lista locações por mês (para gráficos)
 *     tags: [Dashboard]
 *     parameters:
 *       - in: query
 *         name: ano
 *         schema:
 *           type: integer
 *         description: Ano de referência (default ano atual)
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.get('/dashboard/locacoes-por-mes', getLocacoesPorMes);

/**
 * @swagger
 * /dashboard/exemplares-disponibilidade:
 *   get:
 *     summary: Retorna totais de exemplares disponíveis, emprestados e indisponíveis
 *     tags: [Dashboard]
 *     responses:
 *       200:
 *         description: Dados retornados com sucesso
 *       500:
 *         description: Erro no servidor
 */
router.get('/dashboard/exemplares-disponibilidade', getExemplaresDisponibilidade);

module.exports = router;

