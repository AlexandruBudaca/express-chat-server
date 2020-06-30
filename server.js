const express = require("express");
const cors = require("cors");
const body = require("body-parser");
const app = express();

app.use(cors());
app.use(body.json());
app.use(express.urlencoded({ extended: false }));
const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};
app.use(express.json());

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
let messages = [welcomeMessage];

app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});
app.get("/messages", (req, res) => {
  res.send(messages);
});
app.post("/messages", (req, res) => {
  req.body.from === "" || req.body.text === ""
    ? res.send("Sorry! Please complete all the fields.").sendStatus(400)
    : messages.push({
        id: messages.find((id) => {
          messages.id === id.id ? messages.length - 1 + 1 : messages.length + 1;
        }),

        name: req.body.from,
        text: req.body.text,
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

app.listen(process.env.PORT || 4000);
