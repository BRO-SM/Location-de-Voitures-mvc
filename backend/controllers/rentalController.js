const db = require('../db/connection');

const rentalController = {
  // Créer une nouvelle réservation
  createRental: async (req, res) => {
    const { car_id, start_date, end_date } = req.body;
    const user_id = req.user.user_id; // Extrait du token

    try {
      // Vérifier que la date de fin est après la date de début
      if (new Date(end_date) <= new Date(start_date)) {
        return res
          .status(400)
          .json({ message: "❌ La date de fin doit être postérieure à la date de début" });
      }

      // Récupérer le prix de la voiture
      const [cars] = await db
        .promise()
        .query("SELECT price_per_day FROM Cars WHERE car_id = ?", [car_id]);
      if (cars.length === 0) {
        return res.status(404).json({ message: "🚗 Voiture non trouvée" });
      }

      const pricePerDay = parseFloat(cars[0].price_per_day);
      const days = Math.ceil(
        (new Date(end_date) - new Date(start_date)) / (1000 * 60 * 60 * 24)
      );
      const total_price = pricePerDay * days;

      // Créer la réservation
      await db.promise().query(
        `INSERT INTO Rental (user_id, car_id, start_date, end_date, total_price) 
         VALUES (?, ?, ?, ?, ?)`,
        [user_id, car_id, start_date, end_date, total_price]
      );

      res.status(201).json({ message: "✅ Réservation créée avec succès", total_price });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Erreur lors de la création de la réservation" });
    }
  },

  // Récupérer toutes les réservations
  getRentals: async (req, res) => {
    try {
      const [rentals] = await db.promise().query("SELECT * FROM Rental");
      res.json(rentals);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Erreur lors de la récupération des réservations" });
    }
  },

  // Mettre à jour le statut d'une réservation
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
      const [result] = await db
        .promise()
        .query(
          "UPDATE Rental SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE rental_id = ?",
          [status, rentalId]
        );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "🚫 Réservation non trouvée" });
      }

      res.json({ message: `✅ Statut de la réservation mis à jour vers "${status}"` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Erreur lors de la mise à jour du statut" });
    }
  },

  // Supprimer une réservation
  deleteRental: async (req, res) => {
    const rentalId = req.params.id;

    try {
      const [result] = await db
        .promise()
        .query("DELETE FROM Rental WHERE rental_id = ?", [rentalId]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "🚫 Réservation non trouvée" });
      }

      res.json({ message: "🗑️ Réservation supprimée avec succès" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Erreur lors de la suppression de la réservation" });
    }
  },
};

module.exports = rentalController;
