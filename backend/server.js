// server.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const carRoutes = require('./routes/car');
const rentalRoutes = require('./routes/rental');
const adminRoutes = require('./routes/admin');


const app = express();
app.use(cors());
app.use(bodyParser.json());

// Définition des routes principales de l'API
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/uploads/cars', express.static(path.join(__dirname, 'public/uploads/cars')));
app.use('/api/rentals', rentalRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚗 Serveur démarré sur le port ${PORT}`);
});
