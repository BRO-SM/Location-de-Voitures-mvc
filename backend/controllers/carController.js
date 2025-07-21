const db = require("../db/connection");

const carController = {
  // Ajouter une nouvelle voiture
  addCar: async (req, res) => {
    const {
      make,
      model,
      year,
      color,
      fuel,
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
        (make, model, year, color, fuel, license_plate, price_per_day, status, description, seats, transmission) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ? , ?, ?)`,
        [
          make,
          model,
          year,
          color,
          fuel,
          license_plate,
          price_per_day,
          status,
          description,
          seats,
          transmission,
        ]
      );

      res.status(201).json({ message: "✅ Voiture ajoutée avec succès",car_id:existing[0].car_id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Erreur du serveur lors de l'ajout de la voiture" });
    }
  },
 
  adimgcar: async (req, res) => {
    const car_id = req.params.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Aucune image fournie" });
    }

    const image_url = file.filename;

    try {
      await db.promise().query(
        "INSERT INTO imgs (car_id, image_url) VALUES (?, ?)",
        [car_id, image_url]
      );

      res.status(201).json({ message: "✅ Image ajoutée avec succès", filename: image_url });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "❌ Erreur lors de l'enregistrement de l'image" });
    }
  },


  // Afficher toutes les voitures
  getAllCars: async (req, res) => {
  try {
  
    const [cars] = await db.promise().query("SELECT * FROM Cars");

    if (cars.length === 0) {
      return res.json([]); 
    }
    const carIds = cars.map(car => car.car_id);
    // Get all images for these cars
    const placeholders = carIds.map(() => '?').join(',');
const [images] = await db.promise().query(
  `SELECT * FROM imgs WHERE car_id IN (${placeholders})`,
  carIds
);
    const carsWithImages = cars.map(car => ({
      ...car,
      images: images.filter(img => img.car_id === car.car_id)
    }));

    res.json(carsWithImages);
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
      fuel,
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
        make = ?, model = ?, year = ?, color = ? , fuel = ?, license_plate = ?, 
        price_per_day = ?, status = ?, description = ?, seats = ?, transmission = ?
        WHERE car_id = ?`,
        [
          make,
          model,
          year,
          color,
          fuel,
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
