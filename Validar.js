const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


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


app.post('/login', (req, res) => {
    const email = req.body.Usuário;
    const senha = req.body.senha;

    const sql = 'SELECT * FROM usuarios WHERE email = ? AND palavra_passe = ?';

    db.query(sql, [email, senha], (err, results) => {
        if (err) {
            res.status(500).send('Erro ao validar os dados');
            throw err;
        }
        if (results.length > 0) {
            
            res.redirect('index');
        } else {
            res.status(401).send('Usuário ou senha incorretos');
        }
    });
});


app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
