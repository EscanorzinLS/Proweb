const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Configurações para o body-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Configurações da conexão com o banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'web'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Conectado ao banco de dados MySQL');
});


app.post('/submit', (req, res) => {
    const formData = req.body;

    const sql = 'INSERT INTO usuarios (nome, apelido, email, palavra_passe, data_nascimento, naturalidade, genero, escolaridade, generos_favoritos, observacoes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    const values = [
        formData.nome,
        formData.Apelido,
        formData.Email,
        formData['palavra-passe'],
        formData.Data_de_nascimento,
        formData.naturalidade,
        formData.genero,
        formData.escolaridade,
        formData.generos_favoritos.join(', '),
        formData.Comentários
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            res.status(500).send('Erro ao salvar dados');
            throw err;
        }
        res.send('Dados salvos com sucesso');
    });
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
