const express = require("express");
const fs = require("fs");
const path = require("path");
const newUUID = require('./notes/uuid');
const app = express();
const port = 3000;

const dbFilePath = path.join(__dirname, "db", "db.json");

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("html_css"));

app.get("/notes", (req, res) =>{
    res.sendFile(path.join(__dirname, "html_css", "notes.html"));
});

app.get("/api/notes", (req, res) =>{
   console.info(`GET /api/notes`);
   fs.readFile(dbFilePath, "utf8", (err, data) =>{
    if(err) {
        console.error(err);
        return res.status(404).json({error: "Internal server error"});
    }
    const notes = JSON.parse(data);
    res.status(200).json(notes);
   });
});

app.post("/api/notes", (req, res) =>{
   console.info(`${req.method} request recieved to add notes`);

   fs.readFile(dbFilePath, "utf8", (err, data) =>{
    if(err) {
        console.error(err);
        return res.status(404).json({error: "Internal server error"});
    }
    const notes = JSON.parse(data);
    const newNotes = {
        id: newUUID(),
        title: req.body.title,
        text: req.body.text,
    };
    notes.push(newNotes);
    fs.writeFile(dbFilePath, JSON.stringify(notes), (err) => {
        if(err) {
            console.error(err);
            return res.status(404).json({error: "Internal server error"});
        }
        res.status(200).json(newNotes);
    });
   });
});

app.get("*", (req, res) =>{
    res.sendFile(path.join(__dirname, "html_css", "index.html"));
});

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`);
});