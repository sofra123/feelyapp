DROP TABLE IF EXISTS users
CASCADE;

CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    first VARCHAR(255) NOT NULL,
    last VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    url VARCHAR(255),
    bio VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);




-- DROP TABLE IF EXISTS friendships;
-- CREATE TABLE friendships
-- (
--     id SERIAL PRIMARY KEY,
--     receiver_id INT NOT NULL REFERENCES users(id),
--     sender_id INT NOT NULL REFERENCES users(id),
--     accepted BOOLEAN DEFAULT false,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

  