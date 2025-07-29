// routes/car.js
const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
const authenticate = require("../middleware/auth");
const upload = require('../middleware/upload');

// Ajouter une voiture
router.post("/add", authenticate, carController.addCar);

// Ajouter une images de voiture
router.put(
  "/add/image/:id",
  authenticate,
  upload.single('image'), // 'image' is the name of the field in the form
  carController.adimgcar
);

// Obtenir toutes les images de voiture
router.get("/images/:car_id", carController.getCarImages);

// Obtenir toutes les voitures
router.get("/", carController.getAllCars);

// Obtenir une voiture par ID
router.get("/:id", carController.getCarById);

// Modifier une voiture
router.put("/update/:id", authenticate, carController.updateCar);

router.delete("/images/:imgId", authenticate, carController.deleteCarImage);

// Supprimer une voiture
router.delete("/:id", authenticate, carController.deleteCar);

module.exports = router;
