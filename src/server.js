const express = require('express');
const swaggerDocs = require('./swagger');
const app = express();

const alunoRoutes = require('./routes/aluno'); 
const turmaRoutes = require('./routes/turma');

app.use(express.json());

app.use('/', turmaRoutes);
app.use('/', alunoRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  swaggerDocs(app, PORT);
});
