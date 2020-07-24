const express = require("express");
const cors = require("cors");
const body = require("body-parser");
const app = express();
const mongodb = require("mongodb");
const dotenv = require("dotenv");
app.use(cors());
app.use(body.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
dotenv.config();
const uri = process.env.DATABASE_URI;

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

app.put("/message/update/:id", (req, res) => {
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

    const searchObject = { _id: id };

    const { from, text } = req.body;

    const updateObject = {
      $set: {
        from: from,
        text: text,
      },
    };
    const options = { returnOriginal: false };

    collection.findOneAndUpdate(searchObject, updateObject, options, function (
      error,
      result
    ) {
      if (result.deletedCount === 0) {
        res.sendStatus(422);
      } else {
        res.send(error || { message: "Message was updated!" } || 404);
      }

      client.close();
    });
  });
});

const port = process.env.PORT || 5000;
app.listen(port, function () {
  console.log(`Running at \`http://localhost:${port}\`...`);
});
