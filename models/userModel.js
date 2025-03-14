const db = require('../config/db');
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

exports.registerUser = async (name, phone, email, password, gender, location) => {
  const query = 'INSERT INTO users (name, phone, email, password, gender, location) VALUES (?, ?, ?, ?, ?, ?)';

  try {
    const [results] = await db.query(query, [name, phone, email, password, gender, location]);
    return results; 
  } catch (err) {
    throw err; 
  }
};

exports.findUserByEmail = (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], callback);
};

exports.findUserById = async (id, callback) => {
  const query = 'SELECT id, name, email, phone, role, gender, location FROM users WHERE id = ?';
  
  try {
    const [results] = await db.query(query, [id]); 
    if (results.length === 0) {
      return callback(null, null);
    }
    callback(null, results[0]); 
  } catch (err) {
    callback(err, null); 
  }
};


exports.getAllUsers = async (callback) => {
  const query = 'SELECT * FROM users';
  try {
    const [results, fields] = await db.query(query);
    callback(null, results); 
  } catch (err) {
    callback(err, null); 
  }
};

exports.getUserByEmail = async (email, callback) => {
  const query = 'SELECT * FROM users WHERE email = ?';
  try {
    const [results, fields] = await db.query(query, [email]);

    if (results.length > 0) {
      callback(null, results[0]);
    } else {
      callback(null, null);
    }
  } catch (err) {
    callback(err, null);
  }
};

exports.updatePassword = async (email, password) => {
  const query = 'UPDATE users SET password = ? WHERE email = ?';

  try {
    const [results] = await db.query(query, [password, email]);
    return results;
  } catch (err) {
    throw err;
  }
};

exports.verifySecurityAnswer = (email, phone, callback) => {
  const query = 'SELECT * FROM users WHERE email = ? AND phone = ?';
  db.query(query, [email, phone], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results.length > 0);
  });
};

exports.updatePassword = (email, newPassword, callback) => {
  const query = 'UPDATE users SET password = ? WHERE email = ?';
  db.query(query, [newPassword, email], callback);
};