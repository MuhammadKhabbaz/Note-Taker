const express = require("express");
const path = require("path");
const db = require("./db/db.json")

const app = express();

const PORT = 3001
//middleware accessing public folder
app.use(express.static('public'))

app.get('/',(req,res) => {
 console.log("homepage")
});
app.get('/notes', (req,res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
    res.json(db);
})

app.listen(PORT, () => {
    console.log("listening on port 3001")
});