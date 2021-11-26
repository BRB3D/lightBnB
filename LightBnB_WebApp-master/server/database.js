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
  const text = `SELECT  reservations.*, properties.*, avg(rating) as average_rating
  FROM reservations
  JOIN properties ON reservations.property_id = properties.id
  JOIN property_reviews ON properties.id = property_reviews.property_id
  WHERE reservations.guest_id = $1 AND reservations.start_date > now()::date
  GROUP BY properties.id, reservations.id
  ORDER BY reservations.start_date
  LIMIT $2;`

  return pool
    .query(text, [guest_id, limit])
    .then((result) => result.rows)
    .catch((err) => err.message);
}
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */

const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1 = 1
  `;

  // 3 CITY
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += ` AND city LIKE $${queryParams.length} `;
  }

  //4 OWNER
  if (options.owner_id) {
    queryParams.push(`${options.owner_id}`);
    queryString += `AND owner_id = $${queryParams.length} `;
  }

  //5 MINIMUM Price
  if (options.minimum_price_per_night) {
    queryParams.push(`${options.minimum_price_per_night * 100}`);
    queryString += `AND cost_per_night >= $${queryParams.length} `;
  }

  //6 MAXIMUM Price
  if (options.maximum_price_per_night) {
    queryParams.push(`${options.maximum_price_per_night * 100}`);
    queryString += `AND cost_per_night <= $${queryParams.length} `

  }
  //7 Min Rating


  queryString += `GROUP BY properties.id `;

  if (options.minimum_rating) {
    queryParams.push(`${options.minimum_rating}`);
    queryString += `HAVING avg(property_reviews.rating) >= $${queryParams.length} `;
  }

  queryParams.push(limit);
  queryString += `ORDER BY cost_per_night LIMIT $${queryParams.length};`;



  return pool.query(queryString, queryParams).then((res) => res.rows);
};



exports.getAllProperties = getAllProperties;




/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const props = [property.owner_id, property.title, property.description, property.thumbnail_photo_url, property.cover_photo_url, property.cost_per_night, property.street, property.city, property.province, property.post_code, property.country, property.parking_spaces, property.number_of_bathrooms, property.number_of_bedrooms];
  console.log(props);
  const txt = `INSERT INTO properties (owner_id, title, description,thumbnail_photo_url, cover_photo_url,  cost_per_night, street, city,  province, post_code, country, parking_spaces, number_of_bathrooms, number_of_bedrooms)
 VALUES ($1, $2, $3, $4, $5, $6 * 100, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *;`;

  return pool.query(txt, props)
    .then(res => console.log(res.rows))
    .catch(err => err.message);
}
exports.addProperty = addProperty;
