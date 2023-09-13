const express = require('express');
const app = express();

// Define a route that returns "Hello, World!"
app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

// Start the server on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
