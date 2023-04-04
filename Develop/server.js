const express = require('express');
const path = require('path');
const notes = require('./db/notes');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

// Get route for the Homepage
app.get('/', (req, res) => res.send('public/index.html'));
// GET route for the Notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
    res.status(200).json(notes);
});

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text ) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
      };
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting review');
    }
  });

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);