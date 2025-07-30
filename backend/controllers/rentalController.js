// controllers/rentalController.js
const db = require("../db/connection");

const rentalController = {
  // Créer une nouvelle réservation
  createRental: (req, res) => {
    const { car_id, start_date, end_date } = req.body;
    const user_id = req.user.user_id;

    if (new Date(end_date) <= new Date(start_date)) {
      return res.status(400).json({
        message: "❌ La date de fin doit être postérieure à la date de début",
      });
    }

    db.query(
      "SELECT price_per_day FROM Cars WHERE car_id = ?",
      [car_id],
      (err, cars) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "❌ Erreur serveur" });
        }

        if (cars.length === 0) {
          return res.status(404).json({ message: "🚗 Voiture non trouvée" });
        }

        const pricePerDay = parseFloat(cars[0].price_per_day);
        const days = Math.ceil(
          (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)
        );
        const total_price = pricePerDay * days;

        db.query(
          `INSERT INTO Rental (user_id, car_id, start_date, end_date, total_price) VALUES (?, ?, ?, ?, ?)`,
          [user_id, car_id, start_date, end_date, total_price],
          (err2) => {
            if (err2) {
              console.error(err2);
              return res
                .status(500)
                .json({ message: "❌ Erreur lors de la réservation" });
            }

            res.status(201).json({
              message: "✅ Réservation créée avec succès",
              total_price,
            });
          }
        );
      }
    );
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
  updateRentalStatus: (req, res) => {
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

    db.query(
      "UPDATE Rental SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE rental_id = ?",
      [status, rentalId],
      (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "❌ Erreur de mise à jour" });
        }

        if (result.affectedRows === 0) {
          return res
            .status(404)
            .json({ message: "🚫 Réservation non trouvée" });
        }

        res.json({ message: `✅ Statut mis à jour vers "${status}"` });
      }
    );
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
