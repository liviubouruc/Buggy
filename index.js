// Import packages
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v1: uuidv1 } = require('uuid');

const fs = require("fs");

// Aplicatia
const app = express();
app.use(express.static('public_html'))

// Middleware
app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

// Create
app.post("/bugs", (req, res) => {        //Send data to server
  const bugsList = readJSONFile();
  var newId = uuidv1();
  var newBug =
  {
    title: req.body.title,
    description: req.body.description,
    id: newId
  };
  bugsList.push(newBug);
  writeJSONFile(bugsList);
  res.send(bugsList);
});

// Read One
app.get("/bugs/:id", (req, res) => {
  const bugsList = readJSONFile();
  var found = 0;
  for(var i = 0; i < bugsList.length; i++)
    if(bugsList[i].id == req.params.id)
    {
      res.send(bugsList[i]);
      found = 1;
      break;
    }
  if(found == 0)
      res.send("Not found!");
});

// Read All
app.get("/bugs", (req, res) => {
  const bugsList = readJSONFile();
  res.send(bugsList);
});

// Update
app.put("/bugs/:id", (req, res) => {
  const bugsList = readJSONFile();
  var found = 0;
  for(var i = 0; i < bugsList.length; i++)
        if(bugsList[i].id == req.params.id)
        {
            found = 1;
            bugsList[i].title = req.body.title;
            bugsList[i].description = req.body.description;
            res.send(bugsList[i]);
            break;
        }
    writeJSONFile(bugsList);
    if(found == 0)
      res.send("Not found");
});

// Delete
app.delete("/bugs/:id", (req, res) => {
  const bugsList = readJSONFile();
    var found = 0;
    for(var i = 0; i < bugsList.length; i++)
        if(bugsList[i].id == req.params.id)
        {
            bugsList.splice(i, 1);
            found = 1;
            break;
        }
    writeJSONFile(bugsList);
    if(found == 0) res.send("Not found!");
    else res.send("Item deleted!");

});

// Functia de citire din fisierul db.json
function readJSONFile() {
  return JSON.parse(fs.readFileSync("db.json"))["bugs"];
}
// Functia de scriere in fisierul db.json
function writeJSONFile(content) {
  fs.writeFileSync(
    "db.json",
    JSON.stringify({ bugs: content }),
    "utf8",
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
}

app.listen("3000", () =>
  console.log("Server started at: http://localhost:3000")
);