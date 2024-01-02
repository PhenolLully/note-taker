const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;

app.get("/notes", (req, res) =>{
    res.sendFile(__dirname + "/public/notes.html");
});

app.get("*", (req, res) =>{
    res.sendFile(__dirname + "/public/index.html");
});

app.listen(port, () =>{
    console.log(`Server is listening on port ${port}`);
});


app.use(express.json());

app.get("/api/notes", (req, res) =>{
    fs.readFile()
});