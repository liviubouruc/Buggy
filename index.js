const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v1: uuidv1 } = require('uuid');

const fs = require("fs");

const app = express();
app.use(express.static('public_html'))

app.use(morgan("tiny"));
app.use(bodyParser.json());
app.use(cors());

app.post("/bugs", (req, res) => {
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

app.get("/bugs", (req, res) => {
  const bugsList = readJSONFile();
  res.send(bugsList);
});

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

function readJSONFile() {
  return JSON.parse(fs.readFileSync("db.json"))["bugs"];
}

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