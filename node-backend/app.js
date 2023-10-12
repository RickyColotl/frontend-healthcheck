const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const mysql = require('mysql');
const router = express.Router();
app.use(cors());
app.use(express.json());
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const con = mysql.createConnection({
  host: 'localhost',//"sql1.njit.edu"
  user: 'root',
  password: 'December7350',
  port: 3306,
  database: 'sakila'
});

con.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/hello', (req, res) => {
  con.query('USE sakila', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error fetching data' });
      return;
    }
    res.json(results);
  });
});

app.get('/top-movies', (req, res) => {
  const query1 = `
  SELECT f.title, f.description, f.release_year, f.rating, COUNT(*) AS rented
  FROM film AS f
  JOIN inventory AS i ON f.film_id = i.film_id
  JOIN rental AS r ON i.inventory_id = r.inventory_id
  GROUP BY f.film_id
  ORDER BY rented DESC
  LIMIT 5;
  `;
  con.query(query1, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error fetching data' });
      return;
    }
    res.json(results);
  });
});

app.get('/top-actors', (req, res) => {
  const query1 = `
  SELECT a.actor_id, a.first_name, a.last_name, COUNT(DISTINCT fa.film_id) AS movie_count
  FROM actor a
  JOIN film_actor fa ON a.actor_id = fa.actor_id
  JOIN inventory i ON i.film_id = fa.film_id
  WHERE i.store_id = 1
  GROUP BY a.actor_id, a.first_name, a.last_name
  ORDER BY movie_count DESC, a.actor_id
  LIMIT 5;
  `;
  con.query(query1, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error fetching data' });
      return;
    }
    res.json(results);
  });
});

app.get('/search-movies', (req, res) => {
  const searchTerm = req.query.searchTerm;
  
  // FIX SQL Query only works for Film Name
  const query1 = `
    SELECT f.film_id, f.title, f.description, f.release_year, f.rating, c.name AS category
    FROM film f
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    WHERE f.title LIKE ?
    `;
    const values = [`%${searchTerm}%`];

  con.query(query1, values, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    res.json(results);
  });
});

app.get('/rentMovie', (req, res) => {
  const filmId = Number(req.query.filmId);
  const customerId = Number(req.query.customerId);

  // 1. Validate filmId and customerId
  if (!filmId || !customerId) {
      return res.status(400).json({ error: 'filmId and customerId are required.' });
  }

  // 2. Check if film is available for rent
  const checkAvailabilityQuery = `
    SELECT inventory_id
    FROM inventory
    WHERE film_id = ? 
    AND inventory_id NOT IN (SELECT inventory_id FROM rental WHERE return_date IS NULL)
    LIMIT 1;
  `;

  con.query(checkAvailabilityQuery, [filmId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error.' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Film is not available for rent.' });
    }

    const inventoryId = results[0].inventory_id;

    const insertRentalQuery = `
      INSERT INTO rental(rental_date, inventory_id, customer_id, staff_id)
      VALUES(NOW(), ?, ?, 1);
    `;

    con.query(insertRentalQuery, [inventoryId, customerId], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error.' });
      }
      // After successfully inserting
      res.status(200).json({ 
        message: 'Film rented successfully!', 
        rental: {
          filmId: filmId,
          customerId: customerId,
          rentalDate: new Date()
        } 
      });
    });
  });
});

app.get('/searchCustomers', (req, res) => {
  const searchTerm = `%${req.query.term}%`; 
  const query = `
      SELECT customer_id, first_name, last_name, email, address_id
      FROM customer
      WHERE customer_id LIKE ? OR first_name LIKE ? OR last_name LIKE ?;
  `;
  con.query(query, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error.' });
      }
      res.json(results);
  });
});

app.post('/addCustomer', (req, res) => {
  const { firstName, lastName, email, address_id } = req.body;
  console.log(req.body);
  const insertCustomerQuery = `
      INSERT INTO customer(store_id, first_name, last_name, email, address_id, create_date)
      VALUES (1, ?, ?, ?, ?, NOW());
  `;  // Note: store_id hard-coded as 1
  con.query(insertCustomerQuery, [firstName, lastName, email, address_id], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error.' });
      }
      res.json({ message: 'Customer added successfully!', customerId: results.insertId });
  });
});

app.put('/editCustomer', (req, res) => {
  const { customerId, firstName, lastName, email, address_id } = req.body;
  const updateCustomerQuery = `
      UPDATE customer 
      SET first_name = ?, last_name = ?, email = ?, address_id = ?
      WHERE customer_id = ?;
  `;
  con.query(updateCustomerQuery, [firstName, lastName, email, address_id, customerId], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error.' });
      }
      res.json({ message: 'Customer updated successfully!' });
  });
});

app.delete('/deleteCustomer/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  const deleteCustomerQuery = `
      DELETE FROM customer WHERE customer_id = ?;
  `;
  con.query(deleteCustomerQuery, [customerId], (err, results) => {
      if (err) {
          console.log("Unable to Delete Customer, they have rentals out");
          return res.status(500).json({ error: 'Database error.' });
      }
      if (results.affectedRows === 0) {
          return res.status(404).json({ message: 'Customer not found.' });
      }
      res.json({ message: 'Customer deleted successfully!' });
  });
});

app.get('/customerRentals/:customerId', (req, res) => {
  const customerId = req.params.customerId;
  console.log("Fetching rentals for customer ID:", customerId);
  const getCustomerRentalsQuery = `
  SELECT
      c.customer_id, c.first_name, c.last_name, f.title, r.rental_date, r.return_date
  FROM
      customer c
  JOIN rental r ON c.customer_id = r.customer_id
  JOIN inventory i ON r.inventory_id = i.inventory_id
  JOIN film f ON i.film_id = f.film_id
  WHERE
      c.customer_id = ?;
  `;
  con.query(getCustomerRentalsQuery, [customerId], (err, results) => {
      if (err) {
          return res.status(500).json({ error: 'Database error.' });
      }

      console.log("Fetched rentals:", results);
      res.json(results);
  });
});
