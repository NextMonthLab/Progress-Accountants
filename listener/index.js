const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// POST endpoint to receive messages
app.post('/listen', (req, res) => {
  // Log the full JSON payload
  console.log('Received payload:', JSON.stringify(req.body, null, 2));
  
  // Respond with status message
  res.json({ status: 'received' });
});

// Simple GET endpoint to verify the server is running
app.get('/', (req, res) => {
  res.send('NextMonth Dev Listener is running. Send POST requests to /listen');
});

// Start the server
app.listen(port, () => {
  console.log(`NextMonth Dev Listener running on port ${port}`);
});