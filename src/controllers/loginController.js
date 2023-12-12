const Login = require('../models/LoginModel');

exports.index = (request, response) => {
    response.render('login');
}

exports.register = async (request, response) => {
    try {
        const login = new Login(request.body);
        await login.register();

        if (login.errors.length > 0) {
            request.flash('errors', login.errors);
            //Salvar a sessão
            request.session.save(function () {
                //Agora que a sessão já está salva, está seguro para voltar de onde o formulário veio
                return response.redirect('back');
            })
            return;
        }

        request.flash('success', 'Seu usuário foi criado com sucesso.');
        request.session.save(function() {
            return response.redirect('back');
        })
    } catch (error) {
        console.log(error);
        return res.render('404');

    }
}