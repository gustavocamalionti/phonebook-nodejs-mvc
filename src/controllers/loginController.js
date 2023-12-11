const Login = require('../models/LoginModel');

exports.index = (request, response) => {
    response.render('login');
}

exports.register = (request,response) => {
    const login = new Login(request.body);
    response.send(login.body);
}