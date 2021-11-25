const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');
const password = require('./pas');

const pool = new Pool({
  user: 'labber',
  password: password,
  host: 'localhost',
  port: '5432',
  database: 'lightbnb'
});

/* pool.connect().then(() => {
  console.log('We are connected');
}).catch(err => {
  console.error(err.message);
}); */

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
/* const getUserWithEmail = function(email) {
  let user;
  for (const userId in users) {
    user = users[userId];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      break;
    } else {
      user = null;
    }
  }
  return Promise.resolve(user);
} */
const getUserWithEmail = (email) => {
  const text =
    `SELECT * 
    FROM users
    WHERE email = $1;
    `;
  return pool
    .query(
      text,
      [email])
    .then((result) => result.rows[0] ? result.rows[0] : null)
    .catch((err) => err.message);
};

exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = (id) => {
  const text =
    `SELECT * 
    FROM users
    WHERE id = $1;
    `;
  return pool
    .query(
      text,
      [id])
    .then((result) => result.rows[0] ? result.rows[0] : null)
    .catch((err) => err.message);
};
exports.getUserWithId = getUserWithId;


/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
/* const addUser = function(user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
} */



const addUser = (user) => {
  const values = [user.name, user.email, user.password];
  const text =
    `INSERT INTO users (name , email, password) 
    VALUES($1, $2, $3) RETURNING *;
    `;
  return pool
    .query(
      text,
      values)
    .then((result) => result.rows[0])
    .catch((err) => err.message);
};


exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
/* const getAllProperties = function(options, limit = 10) {
  const limitedProperties = {};
  for (let i = 1; i <= limit; i++) {
    limitedProperties[i] = properties[i];
  }
  return Promise.resolve(limitedProperties);
} */
const getAllProperties = (options, limit = 10) => {
  const text =
    `SELECT * 
    FROM properties
    LIMIT $1;
    `
  return pool
    .query(
      text,
      [limit])
    .then((result) => result.rows)
    .catch((err) => err.message);
};


exports.getAllProperties = getAllProperties;




/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
