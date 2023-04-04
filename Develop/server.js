const express = require('express');
const path = require('path');
const notes = require('./db/notes');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
    console.log("Req Body: ", req.body);
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text ) {
      // Variable for the object we will save
      const newNote = {
        title,
        text,
      };
  
      let savedArr= [];
      // we have to grab the CURRENT data
      fs.readFileSync('./db/notes.json', 'utf8', (err, data) => {
        if(err) throw err;
        console.log("Saved Data: ", data);
        console.log("Saved Type: ", typeof data);
        const savedData = data;
        
        // add our new data
        savedArr = JSON.parse(savedData);
        console.log("Array Data: ", savedArr);
        console.log("Array Type: ", typeof savedArr);
        savedArr.push(newNote);

        // then save the new and old data
      })

      // Save the new data into our DB file (dataset)
      fs.writeFileSync('./db/notes.json', JSON.stringify(savedArr), (err) => {
        if(err) throw err;
        console.log("Saved successfully...");
      })
  
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