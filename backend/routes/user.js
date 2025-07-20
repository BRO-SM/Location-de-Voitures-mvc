const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Inscription d’un nouvel utilisateur
router.post('/inscription', userController.register);

// Connexion de l’utilisateur
router.post('/connexion', userController.login);

module.exports = router;
