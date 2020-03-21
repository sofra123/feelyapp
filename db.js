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

// exports.getUserData = function(userId) {
//     return db.query(
//         `SELECT first, last, email, password, age, city, url FROM users
// LEFT JOIN user_profiles ON user_id = users.id WHERE user_id = $1`,
//         [userId]
//     );
// };

exports.getUser = function(email) {
  return db.query(`SELECT id, password FROM users WHERE email = $1 `, [email]);
};

exports.updatePassword = function(email, password) {
  return db.query(`UPDATE users SET password = $2 WHERE email = $1 `, [
    email,
    password
  ]);
};

// exports.verifyemail = function(email) {
//     return db.query(`SELECT email FROM users WHERE email = $1 `, [email]);
// };

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

exports.insertQuestions = function(userId, questions) {
  return db.query(
    `INSERT INTO questions (userId, questions)
        VALUES ($1, $2) RETURNING *`,
    [userId, questions]
  );
};
