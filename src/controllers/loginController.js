const Login = require('../models/LoginModel');

exports.index = (request, response) => {
    // console.log(request.session.user);
    if (request.session.user) return response.render('login-logado');
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

exports.login = async (request, response) => {
    try {
        const login = new Login(request.body);
        await login.login();

        if (login.errors.length > 0) {
            request.flash('errors', login.errors);
            //Salvar a sessão
            request.session.save(function () {
                //Agora que a sessão já está salva, está seguro para voltar de onde o formulário veio
                return response.redirect('back');
            })
            return;
        }

        if (login.errors.length > 0) {
            request.flash('errors', login.errors);
            //Salvar a sessão
            request.session.save(function () {
                //Agora que a sessão já está salva, está seguro para voltar de onde o formulário veio
                return response.redirect('back');
            })
            return;
        }

        request.flash('success', 'Você entrou no sistema.');
        request.session.user = login.user;
        request.session.save(function() {
            return response.redirect('back');
        })
    } catch (error) {
        console.log(error);
        return res.render('404');

    }
}

exports.logout = async (request, response) => {
  request.session.destroy();
  response.redirect('/');
}