const spicedPg = require("spiced-pg");

const db = spicedPg(
  process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/users"
);

exports.addUser = function(first, last, email, password) {
  return db.query(
    `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
    [first, last, email, password]
  );
};

exports.getUser = function(email) {
  return db.query(`SELECT id, password FROM users WHERE email = $1 `, [email]);
};

exports.updatePassword = function(email, password) {
  return db.query(`UPDATE users SET password = $2 WHERE email = $1 `, [
    email,
    password
  ]);
};

exports.insertsecret = function(code, email) {
  return db.query(
    `INSERT INTO password_reset_codes (code, email)
        VALUES ($1, $2) RETURNING *`,
    [code, email]
  );
};

exports.getCode = function(code) {
  return db.query(`SELECT code FROM password_reset_codes WHERE code = $1 `, [
    code
  ]);
};

//by user id
exports.getUserData = function(userId) {
  return db.query(
    `SELECT *
            FROM users
            WHERE id = $1`,
    [userId]
  );
};

exports.insertImage = function(userId, url) {
  return db.query(
    `UPDATE users SET url = $2 WHERE id = $1 
    RETURNING url`,
    [userId, url]
  );
};

exports.updateBio = function(userId, bio) {
  return db.query(
    `UPDATE users SET bio = $2 WHERE id = $1 
    RETURNING bio`,
    [userId, bio]
  );
};

exports.getLastUsers = function() {
  return db.query(
    `SELECT id, first, last, url
            FROM users
            ORDER BY id DESC
            LIMIT 3`
  );
};

exports.getMatchingUsers = function(val) {
  return db.query(
    `SELECT id, first, last, url
            FROM users
            WHERE first ILIKE $1`,
    [val + "%"]
  );
};

exports.getFriendshipStatus = function(receiver_id, sender_id) {
  return db.query(
    `SELECT * FROM friendships
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)`,
    [receiver_id, sender_id]
  );
};

exports.sendFriendRequest = function(receiver_id, sender_id) {
  return db.query(
    `INSERT INTO friendships
        (receiver_id, sender_id)
         VALUES ($1, $2)`,
    [receiver_id, sender_id]
  );
};

exports.acceptFriendRequest = function(receiver_id, sender_id) {
  return db.query(
    `UPDATE friendships
            SET accepted = true
            WHERE (receiver_id = $1 AND sender_id = $2)
            OR (sender_id = $1 AND receiver_id = $2)
            RETURNING *`,
    [receiver_id, sender_id]
  );
};

exports.deleteFriendship = function(receiver_id, sender_id) {
  return db.query(
    `DELETE FROM friendships
            WHERE (receiver_id = $1 AND sender_id = $2)
            OR (sender_id = $1 AND receiver_id = $2)`,
    [receiver_id, sender_id]
  );
};

exports.getFriendsandWannabe = function(id) {
  return db.query(
    `SELECT users.id, first, last, url, accepted
            FROM friendships
            JOIN users
            ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
            OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
            OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
    [id]
  );
};

exports.getLastTenMessages = function() {
  return db.query(
    `SELECT chats.id, chats.message, chats.sender_id, chats.created_at, users.first, users.last, users.url
FROM chats
JOIN users
ON chats.sender_id = users.id
ORDER BY created_at DESC
LIMIT 10`
  );
};

exports.insertMessage = function(sender_id, msg) {
  return db.query(
    `INSERT INTO chats (sender_id, message)
        VALUES ($1, $2)
        RETURNING message`,
    [sender_id, msg]
  );
};

exports.getUserData = function(userId) {
  return db.query(
    `SELECT *
            FROM users
            WHERE id = $1`,
    [userId]
  );
};

exports.getUserData2 = function(userId) {
  return db.query(
    `SELECT first, last, url, bio, pictures.pic
            FROM users
            JOIN pictures 
            ON user_id = users.id
            WHERE id = $1`,
    [userId]
  );
};

exports.getUserDataOnlineUsers = function(arrayOfIds) {
  return db.query(
    `SELECT first, last, url
            FROM users
            WHERE id = ANY ($1)`,
    [arrayOfIds]
  );
};

exports.getJoinedUser = function(id) {
  return db.query(
    `SELECT first, last, url
            FROM users
            WHERE id = $1`,
    [id]
  );
};

exports.insertPic = function(userId, pic) {
  return db.query(
    `INSERT INTO pictures (user_id, pic) VALUES ($1, $2)
        RETURNING *`,
    [userId, pic]
  );
};

exports.getImages = function(userId) {
  return db.query(
    `SELECT user_id, pic
            FROM pictures
            WHERE user_id = $1
            LIMIT 5`,
    [userId]
  );
};

exports.insertAnswers = function(
  userId,
  answer1,
  answer2,
  answer3,
  sentimentRankrounded
) {
  return db.query(
    `INSERT INTO moods (user_id, answer_1, answer_2, answer_3, sentiment_score) VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
    [userId, answer1, answer2, answer3, sentimentRankrounded]
  );
};

exports.updateAnswers = function(
  userId,
  answer1,
  answer2,
  answer3,
  sentimentRankrounded
) {
  return db.query(
    `UPDATE moods SET user_id =$1, answer_1 = $2, answer_2 = $3 , answer_3 = $4, sentiment_score = $5 
    WHERE moods.created_at > CURRENT_DATE
          RETURNING *`,
    [userId, answer1, answer2, answer3, sentimentRankrounded]
  );
};

exports.getSentimentRank = function(userId) {
  return db.query(
    `SELECT user_id, sentiment_score, created_at
                FROM moods
                WHERE user_id = $1
                AND created_at > current_date - interval '7 day'
                ORDER BY created_at ASC
                LIMIT 7`,
    [userId]
  );
};

exports.getCheckinStatus = function(userId) {
  return db.query(
    `SELECT * FROM moods
    JOIN users
    ON user_id = users.id
    WHERE users.id = $1 AND moods.created_at > CURRENT_DATE `,
    [userId]
  );
};

exports.addGratitude = function(userId, gratitude) {
  return db.query(
    `INSERT INTO gratitudes (user_id, gratitude) VALUES ($1, $2)
          RETURNING *`,
    [userId, gratitude]
  );
};

exports.getGratitude = function(userId) {
  return db.query(
    `SELECT user_id, gratitude, created_at from gratitudes
              WHERE user_id = $1`,
    [userId]
  );
};
