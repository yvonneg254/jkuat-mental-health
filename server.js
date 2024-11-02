const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Set up static files
app.use(express.static(path.join(__dirname, 'public')));

// Set up the main route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
  });
  
  app.use(express.static('public'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
