const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
// Define a route that returns "Hello, World!"
app.get('/hello', (req, res) => {
  res.status(200).json({ status: 'Hello, World! KIA GANG 4 LIFE' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
