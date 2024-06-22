const express = require("express");
const route = express.Router();
const userController = require("../controllers/userController");
const checkAuth = require("../middlewares/checkAuthRole")
route.use(express.json());

// Register a new user
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

// Login a user
route.post('/login', (request, response) => {
    userController.login(
        request.body.email,
        request.body.password,
     )
    .then(res => response.status(200).json(res))
    .catch(err => response.status(500).json(err));
});

// Confirm user email
route.get('/confirmEmail/:email/:emailToken', (request, response) => {
    const { email, emailToken } = request.params;
    userController.confirmEmail(email, emailToken)
        .then(res => response.status(200).json(res))
        .catch(err => response.status(500).json(err));
});

// Forgot password
route.post('/forgotPassword', (request, response) => {
    userController.forgotPassword(request.body.email)
        .then(res => response.status(200).json(res))
        .catch(err => response.status(500).json(err));
});

// Reset password
route.post('/resetPassword', (request, response) => {
    const { newPassword, confirmPassword ,resetToken } = request.body;
    userController.resetPassword(newPassword, confirmPassword, resetToken)
        .then(res => response.status(200).json(res))
        .catch(err => response.status(500).json(err));
});

// Create a new user (CRUD Create)
route.post('/users',checkAuth({ roles: ['ADMIN'] }), (request, response) => {
    userController.createUser(request.body)
        .then(newUser => response.status(201).json(newUser))
        .catch(err => response.status(500).json(err));
});

// Get all users (CRUD Read All)
route.get('/users',checkAuth({ roles: ['ADMIN'] }),(request, response) => {
    userController.getAllUsers()
        .then(users => {
            const filteredUsers = users.filter(user => user.role !== 'ADMIN');
            // Sélectionnez uniquement les champs que vous voulez
            const selectedUsers = filteredUsers.map(user => ({
                id: user.id,
                nom: user.firstName,
                prénom: user.lastName,
                email: user.email,
                adresse:user.address,
                téléphone:user.phone,
                role:user.role
            }));
            response.status(200).json(selectedUsers);
        })
        .catch(err => response.status(500).json(err));
});


// Get a user by ID (CRUD Read)
route.get('/users/:userId',checkAuth({ roles: ['ADMIN'] }), (request, response) => {
    const userId = request.params.userId;
    userController.getUserById(userId)
        .then(user => response.status(200).json(user))
        .catch(err => response.status(404).json({ message: "User not found" }));
});

// Update a user by ID (CRUD Update)
route.put('/users/:userId',checkAuth({ roles: ['ADMIN'] }), (request, response) => {
    const userId = request.params.userId;
    const updatedUserData = request.body;
    userController.updateUser(userId, updatedUserData)
        .then(updatedUser => response.status(200).json(updatedUser))
        .catch(err => response.status(500).json(err));
});

// Delete a user by ID (CRUD Delete)
route.delete('/users/:userId',checkAuth({ roles: ['ADMIN'] }), (request, response) => {
    const userId = request.params.userId;
    userController.deleteUser(userId)
        .then(() => response.status(204).end())
        .catch(err => response.status(500).json(err));
});

module.exports = route;
