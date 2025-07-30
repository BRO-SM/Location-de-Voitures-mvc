// controllers/userController.js
const db = require("../db/connection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { get } = require("../routes/rental");
const e = require("express");

require("dotenv").config();

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
        {
          user_id: user.user_id,
          first_name: user.first_name + " " + user.last_name,
          email: user.email,
          role: user.role,
        },
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
      const [user] = await db
        .promise()
        .query("SELECT * FROM Users WHERE user_id = ?", [userId]);

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
    const { first_name, last_name, phone_number, email, CNE, password } =
      req.body;
    const userIdToUpdate = req.params.id;
    const requester = req.user;

    try {
      const [rows] = await db
        .promise()
        .query("SELECT * FROM Users WHERE user_id = ?", [userIdToUpdate]);
      if (rows.length === 0)
        return res.status(404).json({ message: "Utilisateur non trouvé" });

      const userToUpdate = rows[0];

      if (requester.role === "client") {
        if (requester.user_id != userIdToUpdate) {
          return res.status(403).json({
            message:
              "Accès refusé : impossible de modifier un autre utilisateur.",
          });
        }
        if (userToUpdate.is_verified === 1) {
          return res
            .status(403)
            .json({
              message:
                "Modification interdite : contactez-nous s'il vous plaît.",
            });
        }
      }

      if (password && password.trim() !== "") {
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.promise().query(
          `UPDATE Users 
         SET first_name = ?, last_name = ?, phone_number = ?, email = ?, CNE = ?, password = ?, is_verified = ? 
         WHERE user_id = ?`,
          [
            first_name,
            last_name,
            phone_number,
            email,
            CNE,
            hashedPassword,
            requester.role === "admin" ? 0 : userToUpdate.is_verified,
            userIdToUpdate,
          ]
        );
      } else {
        await db.promise().query(
          `UPDATE Users 
         SET first_name = ?, last_name = ?, phone_number = ?, email = ?, CNE = ?, is_verified = ? 
         WHERE user_id = ?`,
          [
            first_name,
            last_name,
            phone_number,
            email,
            CNE,
            requester.role === "admin" ? 0 : userToUpdate.is_verified,
            userIdToUpdate,
          ]
        );
      }

      res.json({ message: "Client mis à jour avec succès" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Erreur serveur" });
    }
  },

  sendContactMessage: async (req, res) => {
    try {
      const { name, email, message } = req.body;
      const userId = req.user?.user_id || null;

      if (!name || !email || !message) {
        return res
          .status(400)
          .json({ message: "Tous les champs sont requis." });
      }

      await db
        .promise()
        .query(
          `INSERT INTO Contact (user_id, name, email, message) VALUES (?, ?, ?, ?)`,
          [userId, name, email, message]
        );

      res.status(201).json({ message: "Message envoyé avec succès." });
    } catch (error) {
      console.error("Erreur lors de l'envoi du message :", error);
      res.status(500).json({ message: "Erreur serveur." });
    }
  },

  getContactMessages: async (req, res) => {
  try {
    const adminEmail = req.query.adminEmail;

    if (!adminEmail) {
      return res.status(400).json({ message: "Email admin requis" });
    }

    const [rows] = await db.promise().query(
      `SELECT * FROM Contact WHERE recipient_email = ? OR recipient_email IS NULL ORDER BY contact_id DESC`,
      [adminEmail]
    );

    res.json(rows);
  } catch (error) {
    console.error("Erreur lors de la récupération des messages :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
},

markMessageAsRead: async (req, res) => {
  const contactId = req.params.id;
  const recipientEmail = req.user?.email;

  if (!recipientEmail) {
    return res.status(400).json({ message: "Email de l'admin manquant" });
  }

  try {
    await db
      .promise()
      .query(
        "UPDATE Contact SET recipient_email = ? WHERE contact_id = ? AND recipient_email IS NULL",
        [recipientEmail, contactId]
      );

    res.json({ message: "Message marqué comme lu." });
  } catch (error) {
    console.error("Erreur lors du marquage du message :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
},
replyToMessage: async (req, res) => {
  const { contact_id, reply } = req.body;
  const adminEmail = req.user?.email;

  if (!adminEmail) {
    return res.status(401).json({ message: "Authentification requise." });
  }
  if (!contact_id || !reply) {
    return res.status(400).json({ message: "contact_id et reply sont requis." });
  }

  try {
    // تحديث الرسالة في جدول Contact بإضافة الرد
    const [result] = await db.promise().query(
      `UPDATE Contact SET reply = ?, replied_by = ?, replied_at = NOW() WHERE contact_id = ?`,
      [reply, adminEmail, contact_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Message non trouvé." });
    }

    res.json({ message: "Réponse enregistrée avec succès." });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la réponse :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
},



};

module.exports = userController;
