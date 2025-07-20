const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"

  // Vérifier si le token est présent
  if (!token) {
    return res.status(401).json({ message: '🚫 Accès refusé, aucun jeton fourni' });
  }

  try {
    // Vérifier et décoder le token JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ajouter les infos de l'utilisateur à la requête
    next();
  } catch (err) {
    return res.status(403).json({ message: '❌ Jeton invalide ou expiré' });
  }
};

module.exports = authenticate;
