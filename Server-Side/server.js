const express = require('express');
const app = express();
const port = 3000;

// Simple route
app.get('/', (req, res) => {
  res.send('Hello from Server!');
});



hello
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
