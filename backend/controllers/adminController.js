const db = require('../db/connection');

const getAdminStats = (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM Cars", (err, cars) => {
    if (err) {
      console.error("Erreur dans getAdminStats:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    db.query("SELECT COUNT(*) AS total FROM Users WHERE role = 'client'", (err, users) => {
      if (err) {
        console.error("Erreur dans getAdminStats:", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }

      db.query("SELECT COUNT(*) AS total FROM Rental", (err, bookings) => {
        if (err) {
          console.error("Erreur dans getAdminStats:", err);
          return res.status(500).json({ message: "Erreur serveur" });
        }

        res.json({
          cars: cars[0].total,
          clients: users[0].total,
          bookings: bookings[0].total,
        });
      });
    });
  });
};

module.exports = { getAdminStats };
