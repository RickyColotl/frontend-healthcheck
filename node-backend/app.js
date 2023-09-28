const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const mysql = require('mysql');

app.use(cors());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


const con = mysql.createConnection({
  host: 'localhost',//"sql1.njit.edu"
  user: 'root',
  password: 'December7350',
  port: 3306,//check this out
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
  SELECT
  f.title,
  f.description,
  f.release_year,
  f.rating,
  COUNT(*) AS rented
  FROM
    film AS f
  JOIN inventory AS i ON f.film_id = i.film_id
  JOIN rental AS r ON i.inventory_id = r.inventory_id
  GROUP BY
    f.film_id
  ORDER BY
    rented DESC
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
  SELECT 
    a.actor_id,
    a.first_name,
    a.last_name,
    COUNT(DISTINCT fa.film_id) AS movie_count
  FROM
    actor a
  JOIN film_actor fa ON a.actor_id = fa.actor_id
  JOIN inventory i ON i.film_id = fa.film_id
  WHERE 
    i.store_id = 1
  GROUP BY 
    a.actor_id, a.first_name, a.last_name
  ORDER BY
    movie_count DESC, a.actor_id
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
    SELECT
      f.title,
      f.description,
      f.release_year,
      f.rating,
      c.name AS category
    FROM
      film f
    JOIN film_category fc ON f.film_id = fc.film_id
    JOIN category c ON fc.category_id = c.category_id
    WHERE
      f.title LIKE ?
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
