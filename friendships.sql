DROP TABLE IF EXISTS friendships;
CREATE TABLE friendships
(
    id SERIAL PRIMARY KEY,
    receiver_id INT NOT NULL REFERENCES users(id),
    sender_id INT NOT NULL REFERENCES users(id),
    accepted BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
