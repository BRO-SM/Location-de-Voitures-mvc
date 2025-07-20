const db = require('../db/connection');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

require('dotenv').config();

const userController = {
  // Enregistrement d'un nouvel utilisateur
  register: async (req, res) => {
    const { first_name, last_name, phone_number, email, CNE, password } = req.body;

    try {
      // Vérifier si l'utilisateur existe déjà (par email ou CNE)
      const [existing] = await db.promise().query('SELECT * FROM Users WHERE email = ? OR CNE = ?', [email, CNE]);
      if (existing.length > 0) {
        return res.status(400).json({ message: '📧 L\'email ou le CNE est déjà utilisé' });
      }

      // Hachage du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insérer l'utilisateur dans la base de données
      await db.promise().query(
        'INSERT INTO Users (first_name, last_name, phone_number, email, CNE, password) VALUES (?, ?, ?, ?, ?, ?)',
        [first_name, last_name, phone_number, email, CNE, hashedPassword]
      );

      res.status(201).json({ message: '✅ Enregistrement réussi' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '❌ Erreur du serveur' });
    }
  },

  // Connexion utilisateur
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Vérifier si l'utilisateur existe
      const [users] = await db.promise().query('SELECT * FROM Users WHERE email = ?', [email]);
      if (users.length === 0) {
        return res.status(404).json({ message: '❌ Utilisateur non trouvé' });
      }

      const user = users[0];

      // Comparer le mot de passe
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: '❌ Mot de passe incorrect' });
      }

      // Générer un token JWT
      const token = jwt.sign(
        { user_id: user.user_id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      // Mettre à jour la date de dernière connexion
      await db.promise().query('UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = ?', [user.user_id]);

      res.json({ message: '✅ Connexion réussie', token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: '❌ Erreur du serveur' });
    }
  },
};

module.exports = userController;
