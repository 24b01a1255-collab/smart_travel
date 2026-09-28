CREATE DATABASE IF NOT EXISTS smart_travel_guide;

USE smart_travel_guide;


CREATE TABLE IF NOT EXISTS users (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(100) NOT NULL,

    email VARCHAR(150) UNIQUE NOT NULL,

    password VARCHAR(255) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


CREATE TABLE IF NOT EXISTS trips (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    destination VARCHAR(150) NOT NULL,

    people INT NOT NULL,

    days INT NOT NULL,

    budget DECIMAL(12,2) NOT NULL,

    preferences VARCHAR(255),

    total_estimated_cost DECIMAL(12,2),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)

    REFERENCES users(id)

    ON DELETE CASCADE

);


CREATE TABLE IF NOT EXISTS itinerary (

    id INT AUTO_INCREMENT PRIMARY KEY,

    trip_id INT NOT NULL,

    day_number INT NOT NULL,

    place_name VARCHAR(200) NOT NULL,

    category VARCHAR(100),

    estimated_cost DECIMAL(10,2) DEFAULT 0,

    latitude DECIMAL(10,7),

    longitude DECIMAL(10,7),

    FOREIGN KEY (trip_id)

    REFERENCES trips(id)

    ON DELETE CASCADE

);


CREATE TABLE IF NOT EXISTS saved_places (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL,

    place_name VARCHAR(200) NOT NULL,

    category VARCHAR(100),

    latitude DECIMAL(10,7),

    longitude DECIMAL(10,7),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id)

    REFERENCES users(id)

    ON DELETE CASCADE

);