const Contato = require('../models/ContatoModel');

exports.index = async (request, response) => {
    const contatos = await Contato.buscaContatos();
    response.render('index', {
        contatos
    });
    return;
};