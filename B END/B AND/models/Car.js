const db = require('../database/connection');

class Car {
    static async create(carData) {
        const { 
            make,
            model,
            year,
            color,
            license_plate,
            price_per_day,
            description,
            seats,
            transmission,
            img_url // renamed from img
        } = carData;

        const sql1 = `
            INSERT INTO Cars (make, model, year, color, license_plate, price_per_day, description, seats, transmission)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const result = await db.query(sql1, [make, model, year, color, license_plate, price_per_day, description, seats, transmission]);
        const carId = result.insertId;

        const sql2 = `
            INSERT INTO imgs (car_id, img_url, is_primary)
            VALUES (?, ?, ?)
        `;
        await db.query(sql2, [carId, img_url, true]);

        return carId;
    }
    static async findAll() {
        const sql = 'SELECT * FROM Cars ';
        return await db.query(sql);
    }
}

module.exports = Car;
