//VARIÁVEIS DE AMBIENTE
require('dotenv').config();

//INICIALIZAR O EXPRESS
const express = require('express');
const app = express();

//MODELAR A BASE DE DADOS
const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING, {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() => {
        console.log('Conectei à base de dados.');
        app.emit('Pronto')
    })
    .catch(e => console.log(e));

//IDENTIFICAR O NAVEGADOR DO CLIENTE POR COOKIES
const session = require('express-session');

//AS SESSÕES SERÃO SALVAS DENTRO DA BASE DE DADOS
const MongoStore = require('connect-mongo');

//FLASH MESSAGES | VISUALIZAÇÃO ÚNICA
const flash = require('connect-flash');
const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');


app.use(helmet());

//PERMITIR POSTAGEM DE FORMULÁRIO PARA DENTRO DA APLICAÇÃO
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));
const sessionOptions = session({
    secret: 'texto q ninguem vai saber',
    //store: new MongoStore({mongooseConnection: mongoose.connection}),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7, //tempo q vai durar o cookie (7dias)
        httpOnly: true
    },
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING })
});

app.use(sessionOptions);
app.use(flash());

// Precisa indicar ao express a pasta das views e qual engine irá utilizar
app.set('views', path.resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// MIDDLEWARES
app.use(csrf());
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(csrfMiddleware);
app.use(routes);


//SE Pronto, JÁ PODEMOS INICIAR A ROTA DE ACESSO E LIBERAR O APP
app.on('Pronto', () => {
    app.listen(3000, () => {
        console.log('Acessar http://localhost:3000');
        console.log('Servidor executando na porta 3000');
    });
})
