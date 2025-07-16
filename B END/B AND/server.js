const express = require('express');
const cors = require('cors');
require('dotenv').config();

const guestRoutes = require('./routes/guests');
const roomRoutes = require('./routes/rooms');
const reservationRoutes = require('./routes/reservations');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/cars', carRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Hotel Management System API',
        version: '1.0.0',
        endpoints: {
            guests: '/api/guests',
            rooms: '/api/rooms',
            reservations: '/api/reservations'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚗 Car Rental  Management System API running on port ${PORT}`);
    console.log(`🚗 API Documentation available at http://localhost:${PORT}`);
});
 