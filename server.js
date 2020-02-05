const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const todoRoutes = express.Router();
let Todo = require("./model/todo.model");
const PORT = 4000;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://127.0.0.1:27017/todos", { useNewUrlParser: true });
const connection = mongoose.connection;

connection.once("open", function() {
  console.log("MongoDB database connection established successfully");
});

//get All Todos
todoRoutes.route("/").get((req, res) => {
  Todo.find((err, todos) => {
    if (err) {
      console.log(err);
    } else {
      res.json(todos);
    }
  });
});
// get Item by id
todoRoutes.route("/:id").get((req, res) => {
  const id = req.params.id;
  Todo.findById(id, (err, todo) => {
    res.json(todo);
  });
});
//Add new Item
todoRoutes.route("/add").post(function(req, res) {
  console.log(req.body);
  let todo = new Todo(req.body);
  todo
    .save()
    .then(todo => {
      res.status(200).json({ todo: "todo added successfully" });
    })
    .catch(err => {
      res.status(400).send("adding new todo failed");
    });
});

//Update item
todoRoutes.route("/update/:id").put((req, res) => {
  Todo.findById(req.params.id, (err, todo) => {
    if (!todo) res.status(404).send("data not found");
    else {
      todo.todo_description = req.body.todo_description;
      todo.todo_responsible = req.body.todo_responsible;
      todo.todo_priority = req.body.todo_priority;
      todo.todo_completed = req.body.todo_completed;

      todo
        .save()
        .then(todo => {
          res.status(200).json({ todo: "todo updated successfully" });
        })
        .catch(err => {
          res.status(500).send("update not possible");
        });
    }
  });
});

app.use("/todos", todoRoutes);
app.listen(PORT, () => {
  console.log("server is running on Port: " + PORT);
});
