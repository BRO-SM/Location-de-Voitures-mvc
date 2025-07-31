// controllers/carController.js
const db = require("../db/connection");
const upload = require("../middleware/upload");
const { get } = require("../routes/rental");

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
      // Vérifier si la plaque d'immatriculation est utilisée
      const [existing] = await db
        .promise()
        .query("SELECT * FROM Cars WHERE license_plate = ?", [license_plate]);

      if (existing.length > 0) {
        return res.status(400).json({
          message: "🚫 Cette plaque d'immatriculation est déjà utilisée",
        });
      }

      // Insérer la voiture dans la base de données et obtenir le resultat
      const [result] = await db.promise().query(
        `INSERT INTO Cars 
        (make, model, year, color, fuel, license_plate, price_per_day, status, description, seats, transmission) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          make,
          model,
          year,
          color,
          fuel,
          license_plate,
          price_per_day,
          status || "disponible", // If status is not provided, set it to "disponible"
          description,
          seats,
          transmission,
        ]
      );

      // Envoyer une résponse de succès 
      res.status(201).json({
        message: "✅ Voiture ajoutée avec succès",
        car_id: result.insertId, 
      });
    } catch (err) {
      console.error("Erreur détaillée:", err);
      res.status(500).json({
        message: "❌ Erreur du serveur lors de l'ajout de la voiture",
        error: err.message, // Ajouter le message d'erreur dans la résponse
      });
    }
  },

  adimgcar: async (req, res) => {
    try {
      const carId = req.params.id;
      const file = req.file;

      if (!file) {
        return res.status(400).json({ message: "Aucune image envoyée" });
      }

      // Check if the car exists
      const [car] = await db
        .promise()
        .query("SELECT * FROM Cars WHERE car_id = ?", [carId]);
      if (!car.length) {
        return res.status(404).json({ message: "السيارة غير موجودة!" });
      }

      // Check if the car already has a primary image
      const [existingImages] = await db
        .promise()
        .query("SELECT * FROM imgs WHERE car_id = ? AND is_primary = true", [
          carId,
        ]);
      const isPrimary = existingImages.length === 0;

      // Insert the new image
      await db
        .promise()
        .query(
          "INSERT INTO imgs (car_id, img_url, is_primary) VALUES (?, ?, ?)",
          [carId, file.filename, isPrimary]
        );

      res.status(201).json({
        message: "l'image a été ajoutée avec succès",
        filename: file.filename,
        isPrimary: isPrimary,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "❌ Erreur lors de l'ajout de l'image" });
    }
  },

  getCarImages: async (req, res) => {
  const carId = req.params.car_id;
  try {
    const [images] = await db.promise().query(
      "SELECT img_id, img_url FROM imgs WHERE car_id = ?",
      [carId]
    );
    if (images.length === 0) {
      return res.status(404).json({ message: "Aucune image trouvée pour cette voiture." });
    }
    res.json({ images }); // نرجع الصور في حقل images
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur lors de récupération des images" });
  }
},

deleteCarImage: async (req, res) => {
  const imgId = req.params.imgId;
  try {
    await db.promise().query("DELETE FROM imgs WHERE img_id = ?", [imgId]);
    res.json({ message: "🗑️ Image supprimée avec succès" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la suppression de l'image" });
  }
},


  // Afficher toutes les voitures
  getAllCars: async (req, res) => {
  try {
    const [cars] = await db.promise().query("SELECT * FROM Cars");

    if (cars.length === 0) {
      return res.json([]);
    }

    const carIds = cars.map((car) => car.car_id);

    // Get all images for these cars
    const placeholders = carIds.map(() => "?").join(",");
    const [images] = await db
      .promise()
      .query(`SELECT * FROM imgs WHERE car_id IN (${placeholders})`, carIds);

    // Get average ratings for each car
    const [ratings] = await db
      .promise()
      .query(
        `SELECT car_id, ROUND(AVG(rating), 1) AS avg_rating
         FROM Review
         GROUP BY car_id`
      );

    // Create a map: car_id => avg_rating
    const ratingsMap = {};
    ratings.forEach((r) => {
      ratingsMap[r.car_id] = r.avg_rating;
    });

    // Combine cars with their images and ratings
    const carsWithData = cars.map((car) => ({
      ...car,
      avg_rating: ratingsMap[car.car_id] || 0,
      images: images.filter((img) => img.car_id === car.car_id),
    }));

    res.json(carsWithData);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "❌ Erreur lors de la récupération des voitures" });
  }
},

  // Afficher une voiture par ID
getCarById: async (req, res) => {
  const carId = req.params.id;

  try {
    // 1. Fetch car details by ID
    const [car] = await db
      .promise()
      .query("SELECT * FROM Cars WHERE car_id = ?", [carId]);

    if (car.length === 0) {
      return res.status(404).json({ message: "🚗 Car not found" });
    }

    // 2. Fetch images related to the car
    const [images] = await db
      .promise()
      .query("SELECT * FROM imgs WHERE car_id = ?", [carId]);

    // 3. Fetch reviews for the car, including user's full name
    const [reviews] = await db
      .promise()
      .query(
        `SELECT r.*, CONCAT(u.first_name, ' ', u.last_name) AS userName
         FROM Review r
         JOIN Users u ON r.user_id = u.user_id
         WHERE r.car_id = ?
         ORDER BY r.created_at DESC`,
        [carId]
      );

    // 4. Fetch current rental info (if reserved or unavailable)
    const [rentalInfo] = await db
      .promise()
      .query(
        `SELECT start_date, end_date 
         FROM Rental 
         WHERE car_id = ? 
         AND status = 'confirmée'
         AND end_date >= CURDATE()
         ORDER BY start_date ASC LIMIT 1`,
        [carId]
      );

    // 5. Combine car data with its images and current rental (if any)
    const carWithImages = {
      ...car[0],
      images,
      currentRental: rentalInfo[0] || null,
    };

    res.json({ car: carWithImages, reviews });
  } catch (err) {
    console.error("❌ SQL Error:", err);
    res.status(500).json({ message: "❌ Error retrieving car data" });
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

      res.json({
        message: "✅ Données de la voiture mises à jour avec succès",
      });
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ message: "❌ Erreur lors de la mise à jour de la voiture" });
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
      res
        .status(500)
        .json({ message: "❌ Erreur lors de la suppression de la voiture" });
    }
  },
};

module.exports = carController;
