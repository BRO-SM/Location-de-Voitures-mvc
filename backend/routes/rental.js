// routes/rental.js
const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentalController');
const authenticate = require('../middleware/auth');
const verifyToken = require('../middleware/verifyToken');

// Créer une nouvelle réservation
router.post('/creer', authenticate, rentalController.createRental);

// Obtenir toutes les réservations
router.get('/', verifyToken, rentalController.getRentals);

// Mettre à jour le statut d'une réservation
router.put('/:id/etat', authenticate, rentalController.updateRentalStatus);

// Supprimer une réservation
router.delete('/:id', authenticate, rentalController.deleteRental);


router.get('/my-bookings/:userId', authenticate, rentalController.getBookingsByUser);

router.post('/addreview', authenticate, rentalController.addreview);

router.get('/car/:car_id', verifyToken, rentalController.getBookingsByCar);



module.exports = router;
