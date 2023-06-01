const mongoose = require("mongoose");

const singleTask = new mongoose.Schema({
  title: { required: true, type: String },
  description: { required: true, type: String },
  status: { required: true, type: Boolean },
});


const userTodos = new mongoose.Schema({
    username: { required: true, type: "string", unique: true },
  todos: { type: [singleTask], default : [] }
})


module.exports = mongoose.model("task", userTodos)