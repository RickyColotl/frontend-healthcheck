const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
// Define a route that returns "Hello, World!"
app.get('/hello', (req, res) => {
  res.status(200).json({ status: 'Hello, World!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const mysql = require('mysql');

const con = mysql.createConnection({
  host: 'localhost',//"sql1.njit.edu"
  user: 'rc73',
  password: 'December7350',
  port: 3000,//check this out
});


con.connect(function(err) {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.get('/hello', (req, res) => {
  // Example: Fetch data from MySQL database
  connection.query('USE rc73 SELECT * FROM sample', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Error fetching data' });
      return;
    }
    res.json(results);
  });
});

// Add more routes and queries as needed
