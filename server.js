const express = require('express');
const path = require('path');
const notes = require('./db/notes');
const fs = require('fs');
const uuid = require('./public/assets/helpers/uuid');

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
    res.status(200).json(JSON.parse(fs.readFileSync('./db/notes.json')));
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
            id: uuid(),
        }
        console.log('here is newNote: ', newNote)
        
        let savedArr
        
        // we have to grab the CURRENT data
        const data = fs.readFileSync('./db/notes.json');
        // data is being assigned to the readfile result 
        // add our new data
        savedArr = JSON.parse(data);
        console.log("Array Data: ", savedArr);
        console.log("Array Type: ", typeof savedArr);
        savedArr.push(newNote);
        console.log("here is savedArr: ", savedArr);
        // then save the new and old data
        // Save the new data into our DB file (dataset)
        console.log("------------------------")
        fs.writeFileSync('./db/notes.json', JSON.stringify(savedArr));
        console.log('savedArr: ', savedArr)
        console.log("Saved successfully...");

        const response = {
            status: 'success',
            body: newNote,
        };

        res.status(201).json(response);
        console.log("Response: ", response)
    } else {
      res.status(500).json('Error in posting note');
    }
  });

app.delete(`/api/notes/:noteId`, (req, res) => {
  console.info(`${req.method} request received to delete a note`);
  
  const noteId = req.params.noteId;
  const data = fs.readFileSync('./db/notes.json');
  const notes = JSON.parse(data);
  const index = notes.findIndex(note => note.id === noteId);

  if (index !== -1) {
    notes.splice(index, 1);

    // Write the updated notes data back to the file
    fs.writeFileSync('./db/notes.json', JSON.stringify(notes));

    res.status(200).json({ success: true });
  } else {
    res.status(404).json({ error: `Note with ID ${noteId} not found` });
  }

});

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);