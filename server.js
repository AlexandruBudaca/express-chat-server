const express = require("express");
const cors = require("cors");
const body = require("body-parser");
const app = express();

app.use(cors());
app.use(body.json());
app.use(express.urlencoded({ extended: false }));
const welcomeMessage = {
  id: 0,
  from: "Alex",
  text: "Welcome to CYF chat system!",
  timeSent: new Date().toUTCString(),
};
app.use(express.json());

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});
app.get("/messages", (req, res) => {
  res.send(messages);
});
app.post("/messages", (req, res) => {
  req.body.from === "" || req.body.text === ""
    ? res.sendStatus(400)
    : messages.push({
        id: Math.floor(
          Math.random() * Math.floor(messages.length + 100),
          messages.length
        ),
        from: req.body.from,
        text: req.body.text,
        timeSent: new Date().toUTCString(),
      });
  // res.send({"success": true})
});

app.get("/messages/:id", (req, res) => {
  const messId = req.params.id;
  const FilterMessages = messages.filter(
    (mess) => Number(mess.id) === Number(messId)
  );
  res.send(FilterMessages);
});
app.delete("/messages/:id", (req, res) => {
  const delMess = Number(req.params.id);
  messages = messages.filter((mess) => mess.id !== delMess);
  res.send(messages);
});
app.get("/search?", (req, res) => {
  const searchTerm = req.query.term;
  const searchedMess = messages.find(
    (mess) =>
      mess.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mess.text.toLowerCase().includes(searchTerm.toLowerCase())
  );
  !searchedMess ? res.sendStatus(404) : res.send(searchedMess);
});
app.get("/latest", (req, res) => {
  res.send(messages.slice(-10, messages.length));
});
app.put("/update/:id", (req, res) => {
  const reqId = Number(req.params.id);

  let message = messages.find((mess) => mess.id === reqId);

  if (message) {
    let messUpdate = {
      id: message.id,
      from: req.body.from,
      text: req.body.text,
      timeSent: message.timeSent,
    };
    messages.splice(index, 1, messUpdate);
    res.json(message);
  } else {
    res.sendStatus(400);
  }
});

app.listen(process.env.PORT);
