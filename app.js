import express from 'express';
const app = express();
app.get('/hello', (req, res) => { res.send('Hello!') })
app.get('/', (req, res) => { res.send('Welcome to Recipe app API!') })
app.listen(4000);