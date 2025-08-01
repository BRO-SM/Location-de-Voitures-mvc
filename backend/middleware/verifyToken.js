// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Accès refusé. Token manquant." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // تأكد أن لديك JWT_SECRET في env
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(403).json({ message: "Token invalide." });
  }
};
