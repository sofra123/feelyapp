DROP TABLE IF EXISTS pictures;


CREATE TABLE pictures


(
    user_id INT NOT NULL REFERENCES users(id),
    pic VARCHAR(255),
    artist VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
