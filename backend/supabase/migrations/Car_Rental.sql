-- CREATE DATABASE 
CREATE DATABASE IF NOT EXISTS CarRental_db;
USE CarRental_db;


-- USER TABLE
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,  
    CNE VARCHAR(20) NOT NULL UNIQUE,    
    password VARCHAR(255) NOT NULL,
    role ENUM('client', 'admin') DEFAULT 'client',
    is_verified BOOLEAN DEFAULT FALSE,   
    last_login TIMESTAMP NULL,         
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
 

-- CAR TABLE
CREATE TABLE Cars (
    car_id INT AUTO_INCREMENT PRIMARY KEY,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    year INT NOT NULL ,  
    license_plate VARCHAR(20) NOT NULL UNIQUE,  
    color VARCHAR(50) NOT NULL,
    fuel ENUM('Essence', 'Diesel','Hybride', 'Electrique') DEFAULT 'Diesel',
    price_per_day DECIMAL(10,2) NOT NULL,
    status ENUM('disponible','reserve','indisponible','en maintenance') DEFAULT 'disponible',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    description TEXT,                   
    seats TINYINT,                      
    transmission ENUM('automatic','manual') DEFAULT'manual'
);

-- IMG TABLE
CREATE TABLE imgs (
    img_id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    img_url VARCHAR(255)  DEFAULT "../../public/cars-images/CarDefault.png",
    is_primary BOOLEAN DEFAULT FALSE,   
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES Cars(car_id) ON DELETE CASCADE
);
  

-- RENTAL TABLE
CREATE TABLE Rental (
    rental_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status ENUM('en attente','confirmée','annulée','refusée','terminée') DEFAULT 'en attente',
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    payment_status ENUM('pending','paid','failed','refunded') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES Users(user_id) ON DELETE RESTRICT,
    FOREIGN KEY (car_id) REFERENCES Cars(car_id) ON DELETE RESTRICT,
    CONSTRAINT chk_dates CHECK (end_date > start_date)  
);


CREATE TABLE Review (
    review_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    car_id INT NOT NULL,
    rental_id INT NOT NULL,
    rating TINYINT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users(user_id),
    FOREIGN KEY (car_id) REFERENCES Cars(car_id),
    FOREIGN KEY (rental_id) REFERENCES Rental(rental_id)
);



-- CREATE TABLE Payment (
--     payment_id INT AUTO_INCREMENT PRIMARY KEY,
--     rental_id INT NOT NULL,
--     amount DECIMAL(10,2) NOT NULL,
--     payment_method ENUM('credit_card','cash','bank_transfer'),
--     transaction_id VARCHAR(255),
--     payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     status ENUM('pending','completed','failed') DEFAULT 'pending',
--     FOREIGN KEY (rental_id) REFERENCES Rental(rental_id)
-- );


