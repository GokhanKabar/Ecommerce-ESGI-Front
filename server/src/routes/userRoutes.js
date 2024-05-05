const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");

route.use(express.json());

route.post('/register', (request, response) => {
    userController.register(
        request.body.firstName,
        request.body.lastName,
        request.body.password,
        request.body.address,
        request.body.email,
        request.body.phone,
        request.body.role,
        request.body.accountConfirmation
    )
    .then(res => response.status(200).json(res))
    .catch(err => response.status(500).json(err));
});


route.post('/login', (request, response) => {
    userController.login(
        request.body.email,
        request.body.password,
     )
    .then(res => response.status(200).json(res))
    .catch(err => response.status(500).json(err));
});


route.get('/confirmEmail/:email/:emailToken', (request, response) => {
    const { email, emailToken } = request.params;
    userController.confirmEmail(email, emailToken)
        .then(res => response.status(200).json(res))
        .catch(err => response.status(500).json(err));
});


route.post('/forgotPassword', (request, response) => {
    userController.forgotPassword(request.body.email)
        .then(res => response.status(200).json(res))
        .catch(err => response.status(500).json(err));
});


route.post('/resetPassword', (request, response) => {
    
    const { newPassword, confirmPassword ,resetToken} = request.body;
userController.resetPassword(newPassword,confirmPassword,resetToken)
        .then(res => response.status(200).json(res))
        .catch(err => response.status(500).json(err));
});


module.exports = route;
