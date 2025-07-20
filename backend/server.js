const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const userRoutes = require('./routes/user');
const carRoutes = require('./routes/car');
const rentalRoutes = require('./routes/rental');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Définition des routes principales de l'API
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/rentals', rentalRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚗 Serveur démarré sur le port ${PORT}`);
});
