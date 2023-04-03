const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle requests to the root path ("/")
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

app.listen(port, function() {
  console.log('Server started at http://localhost:' + port);
});
