// controllers/rentalController.js
const db = require("../db/connection");

const rentalController = {
  // Créer une nouvelle réservation
 createRental: async (req, res) => {
  const userId = req.user.user_id;
  const { car_id, start_date, end_date } = req.body;

  try {
    // 1. Vérifier le chevauchement des dates
    const [existingRentals] = await db.promise().query(
      `SELECT * FROM Rental 
       WHERE car_id = ? AND status IN ('en attente', 'confirmée')
       AND (
         (start_date <= ? AND end_date >= ?) OR
         (start_date <= ? AND end_date >= ?) OR
         (start_date >= ? AND end_date <= ?)
       )`,
      [car_id, start_date, start_date, end_date, end_date, start_date, end_date]
    );

    if (existingRentals.length > 0) {
      // Vérifier l'espacement d'un jour
      const hasConflict = existingRentals.some(rental => {
        const dbStart = new Date(rental.start_date);
        const dbEnd = new Date(rental.end_date);
        const newStart = new Date(start_date);
        const newEnd = new Date(end_date);

        const diff1 = (newStart - dbEnd) / (1000 * 60 * 60 * 24);
        const diff2 = (dbStart - newEnd) / (1000 * 60 * 60 * 24);

        // Si les dates sont trop proches ou se chevauchent
        return diff1 < 1 && diff2 < 1;
      });

      if (hasConflict) {
        return res.status(400).json({
          message: "❌ La voiture est déjà réservée à ces dates ou trop proche d'une autre réservation.",
        });
      }
    }

    // 2. Calcul du prix
    const [carRows] = await db.promise().query("SELECT price_per_day FROM Cars WHERE car_id = ?", [car_id]);
    const car = carRows[0];
    const days = (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24);
    const total_price = days * car.price_per_day;

    // 3. Insertion du rental
    await db.promise().query(
      "INSERT INTO Rental (user_id, car_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)",
      [userId, car_id, start_date, end_date, total_price]
    );

    res.status(201).json({
      message: "✅ Réservation créée avec succès",
      total_price,
    });
  } catch (err) {
    console.error("Erreur de réservation :", err);
    res.status(500).json({ message: "❌ Erreur lors de la réservation" });
  }
},


  // Récupérer toutes les réservations
 getRentals: (req, res) => {
  const query = `
    SELECT r.*, c.make, c.model, c.year, i.img_url,
           u.first_name, u.last_name, u.email, u.phone_number
    FROM Rental r
    JOIN Cars c ON r.car_id = c.car_id
    LEFT JOIN (
      SELECT car_id, MIN(img_url) AS img_url FROM imgs GROUP BY car_id
    ) i ON c.car_id = i.car_id
    JOIN Users u ON r.user_id = u.user_id
    ORDER BY r.created_at DESC
  `;
  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    res.json(results);
  });
},



  // Mettre à jour le statut
updateRentalStatus: async (req, res) => {
  const rentalId = req.params.id;
  const { status } = req.body;

  const allowedStatuses = [
    "en attente",
    "confirmée",
    "annulée",
    "refusée",
    "terminée",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: "❌ Statut invalide" });
  }

  try {
    const [rentalData] = await db
      .promise()
      .query("SELECT car_id, user_id FROM Rental WHERE rental_id = ?", [rentalId]);

    if (rentalData.length === 0) {
      return res.status(404).json({ message: "🚫 Réservation non trouvée" });
    }

    const { car_id, user_id } = rentalData[0];

    if (status === "confirmée") {
      const [userRows] = await db
        .promise()
        .query("SELECT is_verified FROM Users WHERE user_id = ?", [user_id]);

      if (userRows.length === 0) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      if (userRows[0].is_verified === 0) {
        return res.status(403).json({
          message:
            "❌ Impossible de confirmer : le client n'est pas encore vérifié.",
        });
      }
    }

    const [result] = await db
      .promise()
      .query(
        "UPDATE Rental SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE rental_id = ?",
        [status, rentalId]
      );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "🚫 Réservation non trouvée" });
    }

    
    if (car_id) {
      let carStatus = null;
      if (status === "confirmée") carStatus = "reserve";
      else if (["annulée", "refusée", "terminée"].includes(status))
        carStatus = "disponible";

      if (carStatus) {
        await db
          .promise()
          .query("UPDATE Cars SET status = ? WHERE car_id = ?", [
            carStatus,
            car_id,
          ]);
      }
    }

    res.json({ message: `✅ Statut mis à jour vers "${status}"` });
  } catch (err) {
    console.error("❌ Erreur:", err);
    res.status(500).json({ message: "❌ Erreur de mise à jour" });
  }
},



  // Supprimer une réservation
  deleteRental: (req, res) => {
  const rentalId = req.params.id;
  db.query(
    "DELETE FROM Rental WHERE rental_id = ?",
    [rentalId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ message: "❌ Erreur lors de la suppression" });
      }

      if (result.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "🚫 Réservation non trouvée" });
      }

      res.json({ message: "🗑️ Réservation supprimée avec succès" });
    }
  );
},


  // Récupérer les réservations d’un utilisateur
  getBookingsByUser: (req, res) => {
    const userId = req.params.userId;
    const query = `
      SELECT r.*, c.make AS car_make, c.model AS car_model, i.img_url
      FROM Rental r
      JOIN Cars c ON r.car_id = c.car_id
      LEFT JOIN (
        SELECT car_id, MIN(img_url) AS img_url
        FROM imgs
        GROUP BY car_id
      ) i ON c.car_id = i.car_id
      WHERE r.user_id = ?
      ORDER BY r.created_at DESC

    `;

    db.query(query, [userId], (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "❌ Erreur serveur" });
      }

      res.json(rows);
    });
  },

  // Récupérer les réservations d’un véhicule
  getBookingsByCar: (req, res ) => {
  const carId = req.params.car_id;
  const query = `
    SELECT r.*, u.first_name, u.last_name, u.email, u.phone_number
    FROM Rental r
    JOIN Users u ON r.user_id = u.user_id
    WHERE r.car_id = ?
    ORDER BY r.start_date DESC
  `;
  db.query(query, [carId], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erreur serveur lors de la récupération des réservations" });
    }
    res.json(results);
  });
},


  addreview: (req, res) => {
    const { rating, comment, rentalId } = req.body;
    const userId = req.user.user_id;

    //
    const getCarIdQuery = "SELECT car_id FROM Rental WHERE rental_id = ?";
    db.query(getCarIdQuery, [rentalId], (err, rentalRows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          message: "❌ Erreur serveur lors de la récupération de la location",
        });
      }
      if (rentalRows.length === 0) {
        return res.status(404).json({ message: "🚫 Location non trouvée" });
      }

      const carId = rentalRows[0].car_id;

      const insertQuery = `INSERT INTO Review (user_id, car_id, rental_id, rating, comment) VALUES (?, ?, ?, ?, ?)`;
      db.query(
        insertQuery,
        [userId, carId, rentalId, rating, comment],
        (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).json({
              message: "❌ Erreur serveur lors de l'ajout de la review",
            });
          }
          res.json({ message: "✅ Review added successfully" });
        }
      );
    });
  },
};

module.exports = rentalController;
