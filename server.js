const express = require("express");
const cors = require("cors");
const body = require("body-parser");
const app = express();
const mongodb = require("mongodb");

app.use(cors());
app.use(body.json());
app.use(express.urlencoded({ extended: false }));
const uri =
  "mongodb+srv://AlexandruBudaca:Selet10!@alex.njtpl.mongodb.net/chat?retryWrites=true&w=majority";

app.use(express.json());

app.get("/messages", (req, res) => {
  const client = new mongodb.MongoClient(uri);

  client.connect(function () {
    const db = client.db("chat");
    const collection = db.collection("messages");

    collection.find().toArray(function (error, messages) {
      res.send(error || messages);
      client.close();
    });
  });
});

app.post("/messages", (req, res) => {
  const client = new mongodb.MongoClient(uri);

  client.connect(function () {
    const db = client.db("chat");
    const collection = db.collection("messages");
    const message = {
      timeSent: new Date().toUTCString(),
    };

    if (req.body.from) {
      message["from"] = req.body.from;
    } else {
      res.sendStatus(400);
    }
    if (req.body.text) {
      message["text"] = req.body.text;
    } else {
      res.sendStatus(400);
    }

    collection.insertOne(message, (error, message) => {
      if (message) {
        res.send({ message: "successful" });
      }
      res.send(error || message);
      client.close();
    });
  });
});

app.delete("/messages/:id", (req, res) => {
  const client = new mongodb.MongoClient(uri);

  client.connect(() => {
    const db = client.db("chat");
    const collection = db.collection("messages");
    let id;
    try {
      id = new mongodb.ObjectID(req.params.id);
    } catch (error) {
      res.sendStatus(400);
      return;
    }
    const searchMessageId = { _id: id };
    collection.deleteOne(searchMessageId, (error, message) => {
      if (error) {
        res.send(error);
      }
      if (message.deletedCount === 0) {
        res.sendStatus(400);
      } else {
        res.send({ message: "Message deleted successfully!" });
      }
      console.log(message.deletedCount);
    });
  });
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

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`Running at \`http://localhost:${port}\`...`);
});
