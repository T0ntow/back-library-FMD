const mysql = require('mysql2');
const connection = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '2O11200E',
  database: 'libraryfmd'
});

// Obtendo uma conexão do pool
connection.getConnection((err, connection) => {
  if (err) {
    console.error('Erro ao conectar-se ao MySQL:', err);
    return;
  }
  console.log('Conexão com o MySQL estabelecida!');
  connection.release();
});

module.exports = connection