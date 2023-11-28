const express = require("express");
const path = require("path");
const fs = require('fs');
const db = require("./db/db.json")
const { v4: uuidv4 } = require('uuid');

const PORT = 3001

const app = express();
//middleware accessing public folder
app.use(express.static('public'))
// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/',(req,res) => {
 console.log("homepage")
});
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
})

app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to add a note`);
  
    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;
  
    // If all the required properties are present
    if (title && text) {
      // Variable for the object we will save
      const newNote = {
        id: uuidv4(),
        title,
        text,
      };

    // Write the string to a file
      fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          // Convert string into JSON object
          const parsedNotes = JSON.parse(data);
  
          // Add a new review
          parsedNotes.push(newNote);
  
          // Write updated reviews back to the file
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated notes!')
          );
        }
      });
  
      const response = {
        status: 'success',
        body: newNote,
      };
  
      console.log(response);
      res.status(201).json(response);
    } else {
      res.status(500).json('Error in posting note');
    }
});
app.get('/api/notes', (req, res) => {
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error reading data');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.delete('/api/notes/:id', (req, res) => {
    const idToDelete = req.params.id;
    console.log(idToDelete);
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error reading data');
        }

        let notes = JSON.parse(data);
        // Filter out the note with the ID that matches 'idToDelete'
        notes = notes.filter(note => note.id !== idToDelete);

        fs.writeFile('./db/db.json', JSON.stringify(notes, null, 4), (writeErr) => {
            if (writeErr) {
                console.error(writeErr);
                return res.status(500).send('Error writing data');
            }
            res.status(200).send('Note deleted');
        });
    });
})


app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
});