DROP TABLE IF EXISTS gratitudes
CASCADE;

CREATE TABLE gratitudes

(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    gratitude VARCHAR (250) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


