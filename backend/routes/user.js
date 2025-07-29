const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyToken = require('../middleware/verifyToken');

// Inscription d’un nouvel utilisateur
router.post('/inscription', userController.register);

// Connexion de l’utilisateur
router.post('/connexion', userController.login);

// Récupérer tous les Clients
router.get("/clients", userController.getClientsOnly);

// Récupérer un Client par son ID
router.get('/:id', userController.getUserById);

// Mettre les informations d’un Client
router.put("/update/:id", verifyToken, userController.updateClient);

// verifier les informations d’un Client
router.patch("/verify/:id", userController.verifyClient);



module.exports = router;
