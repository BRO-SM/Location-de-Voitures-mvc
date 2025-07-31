const db = require("../db/connection");

const getAdminStats = (req, res) => {
  db.query("SELECT COUNT(*) AS total FROM Cars", (err, cars) => {
    if (err) {
      console.error("Erreur dans getAdminStats:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }

    db.query(
      "SELECT COUNT(*) AS total FROM Users WHERE role = 'client'",
      (err, users) => {
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
            totalCars: cars[0].total,
            totalUsers: users[0].total,
            totalBookings: bookings[0].total,
          });
        });
      }
    );
  });
};

module.exports = { getAdminStats };
