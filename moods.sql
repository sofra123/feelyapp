DROP TABLE IF EXISTS moods;

CREATE TABLE moods

(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id),
    answer_1 VARCHAR(255),
    answer_2 VARCHAR(255),
    answer_3 VARCHAR(255),
    sentiment_score DECIMAL(10,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


