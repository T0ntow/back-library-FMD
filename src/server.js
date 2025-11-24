const express = require('express');
const cors = require('cors');
const swaggerDocs = require('./swagger');
const app = express();

const alunoRoutes = require('./routes/aluno'); 
const turmaRoutes = require('./routes/turma');
const livroRoutes = require('./routes/livro');
const exemplarRoutes = require('./routes/exemplar');
const bibliotecarioRoutes = require('./routes/bibliotecario');
const locacaoRoutes = require('./routes/locacao');

app.use(express.json());

// ========= CORS =========
app.use(
  cors({
    origin: "http://localhost:5173", // front React (Vite)
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: "Content-Type, Authorization",
  })
);
// =========================

app.use('/', turmaRoutes);
app.use('/', alunoRoutes);
app.use('/', livroRoutes);
app.use('/', exemplarRoutes);
app.use('/', bibliotecarioRoutes);
app.use('/', locacaoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  swaggerDocs(app, PORT);
});
