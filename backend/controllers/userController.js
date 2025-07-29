// controllers/userController.js
const db = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { get } = require('../routes/rental');

require('dotenv').config();

const userController = {
  // Enregistrement d'un nouvel utilisateur
  register: async (req, res) => {
    const { first_name, last_name, phone_number, email, CNE, password } =
      req.body;

    try {
      // Vérifier si l'utilisateur existe déjà (par email ou CNE)
      const [existing] = await db
        .promise()
        .query("SELECT * FROM Users WHERE email = ? OR CNE = ?", [email, CNE]);
      if (existing.length > 0) {
        return res
          .status(400)
          .json({ message: "📧 L'email ou le CNE est déjà utilisé" });
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur dans la base de données
      await db
        .promise()
        .query(
          "INSERT INTO Users (first_name, last_name, phone_number, email, CNE, password) VALUES (?, ?, ?, ?, ?, ?)",
          [first_name, last_name, phone_number, email, CNE, hashedPassword]
        );

      res.status(201).json({ message: "✅ Enregistrement réussi" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Erreur du serveur" });
    }
  },

  // Connexion utilisateur
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Vérifier si l'utilisateur existe
      const [users] = await db
        .promise()
        .query("SELECT * FROM Users WHERE email = ?", [email]);
      if (users.length === 0) {
        return res.status(404).json({ message: "❌ Utilisateur non trouvé" });
      }

      const user = users[0];

      // Comparer le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "❌ Mot de passe incorrect" });
      }

      // Générer un token JWT
      const token = jwt.sign(
        { user_id: user.user_id, first_name: user.first_name, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Mettre à jour la date de dernière connexion
      await db
        .promise()
        .query(
          "UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?",
          [user.user_id]
        );

      res.json({ message: "✅ Connexion réussie", token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "❌ Erreur du serveur" });
    }
  },

  // Récupérer tous les Clients
  getClientsOnly: (req, res) => {
    const query = "SELECT * FROM Users WHERE role = 'client'";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Erreur SQL:", err);
        return res.status(500).json({ message: "Erreur serveur" });
      }
      res.json(results);
    });
  },

  getUserById: async (req, res) => {
  const userId = req.params.id;

  try {
    const [user] = await db.promise().query("SELECT * FROM Users WHERE user_id = ?", [userId]);

    if (user.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // لا تُرجع كلمة المرور!
    const { password, ...userWithoutPassword } = user[0];

    res.json(userWithoutPassword);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
},


 verifyClient: (req, res) => {
  const query = "UPDATE `Users` SET `is_verified` = 1 WHERE `user_id` = ?";
  db.query(query, [req.params.id], (err, results) => {
    if (err) {
      console.error("Erreur SQL:", err);
      return res.status(500).json({ message: "Erreur serveur" });
    }
    if (results.affectedRows === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({ message: "Utilisateur vérifié avec succès" });
  });
},
updateClient: async (req, res) => {
  const { first_name, last_name, phone_number, email, CNE, password } = req.body;
  const userIdToUpdate = req.params.id;
  const requester = req.user; // يجب أن تأتي من التوكن بعد middleware التوثيق

  try {
    // جلب بيانات المستخدم الذي سيتم تحديثه
    const [userRows] = await db.promise().query("SELECT * FROM Users WHERE user_id = ?", [userIdToUpdate]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    const userToUpdate = userRows[0];

    // شرط: إذا الدور client و is_verified = 1، ممنوع التعديل
    if (requester.role === 'client' && userToUpdate.is_verified === 1) {
      return res.status(403).json({ message: "Modification interdite : compte vérifié." });
    }

    // (اختياري) تأكد أن العميل لا يعدل بيانات عميل آخر (يعدل نفسه فقط)
    if (requester.role === 'client' && requester.user_id != userIdToUpdate) {
      return res.status(403).json({ message: "Accès refusé : impossible de modifier un autre utilisateur." });
    }

    // تابع التحديث، بنفس الطريقة مع تشفير كلمة المرور إن وجدت
    if (password && password.trim() !== "") {
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.promise().query(
        "UPDATE Users SET first_name = ?, last_name = ?, phone_number = ?, email = ?, CNE = ?, password = ? WHERE user_id = ?",
        [first_name, last_name, phone_number, email, CNE, hashedPassword, userIdToUpdate]
      );
    } else {
      await db.promise().query(
        "UPDATE Users SET first_name = ?, last_name = ?, phone_number = ?, email = ?, CNE = ? WHERE user_id = ?",
        [first_name, last_name, phone_number, email, CNE, userIdToUpdate]
      );
    }

    res.json({ message: "Client mis à jour avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
}



};


module.exports = userController;
