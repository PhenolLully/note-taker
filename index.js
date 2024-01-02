const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const uuid = require('./notes/uuid');
const dbFilePath = path.join(__dirname, "db", "notes.json");

app.use(express.json());

app.get("/notes", (req, res) =>{
    res.sendFile(path.join(__dirname, "public", "notes.html"));
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
        id: uuid(),
        title: req.body.title,
        content: req.body.content,
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
    res.sendFile(path.join(__dirname, "public", "notes.html"));
});

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`);
});