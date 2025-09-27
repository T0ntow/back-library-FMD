const mysql = require('mysql2');


const connection = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'WPP102315tom@',
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