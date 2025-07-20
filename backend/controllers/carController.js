const db = require("../db/connection");

const carController = {
  // Ajouter une nouvelle voiture
  addCar: async (req, res) => {
    const {
      make,
      model,
      year,
      color,
      license_plate,
      price_per_day,
      status,
      description,
      seats,
      transmission,
    } = req.body;

    try {
      // Vérifier si l'immatriculation existe déjà
      const [existing] = await db
        .promise()
        .query("SELECT * FROM Cars WHERE license_plate = ?", [license_plate]);

      if (existing.length > 0) {
        return res
          .status(400)
          .json({ message: "🚫 Cette plaque d'immatriculation est déjà utilisée" });
      }

      // Insérer la voiture dans la base de données
      await db.promise().query(
        `INSERT INTO Cars 
        (make, model, year, color, license_plate, price_per_day, status, description, seats, transmission) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          make,
          model,
          year,
          color,
          license_plate,
          price_per_day,
          status,
          description,
          seats,
          transmission,
        ]
      );

      res.status(201).json({ message: "✅ Voiture ajoutée avec succès" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Erreur du serveur lors de l'ajout de la voiture" });
    }
  },

  // Afficher toutes les voitures
  getAllCars: async (req, res) => {
    try {
      const [cars] = await db.promise().query("SELECT * FROM Cars");
      res.json(cars);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Erreur lors de la récupération des voitures" });
    }
  },

  // Modifier une voiture
  updateCar: async (req, res) => {
    const carId = req.params.id;
    const {
      make,
      model,
      year,
      color,
      license_plate,
      price_per_day,
      status,
      description,
      seats,
      transmission,
    } = req.body;

    try {
      await db.promise().query(
        `UPDATE Cars SET 
        make = ?, model = ?, year = ?, color = ?, license_plate = ?, 
        price_per_day = ?, status = ?, description = ?, seats = ?, transmission = ?
        WHERE car_id = ?`,
        [
          make,
          model,
          year,
          color,
          license_plate,
          price_per_day,
          status,
          description,
          seats,
          transmission,
          carId,
        ]
      );

      res.json({ message: "✅ Données de la voiture mises à jour avec succès" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Erreur lors de la mise à jour de la voiture" });
    }
  },

  // Supprimer une voiture
  deleteCar: async (req, res) => {
    const carId = req.params.id;

    try {
      await db.promise().query("DELETE FROM Cars WHERE car_id = ?", [carId]);
      res.json({ message: "🗑️ Voiture supprimée avec succès" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Erreur lors de la suppression de la voiture" });
    }
  },
};

module.exports = carController;
