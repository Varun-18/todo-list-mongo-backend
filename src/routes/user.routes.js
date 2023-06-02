const express = require("express");
const userRouter = express.Router();
const {
  addUser,
  login,
  authenticateUser,
  addTask,
  deleteTask,
  updateTask,
  userLogout
} = require("../controller/user.controller");

userRouter.get("/authenticate", authenticateUser);
userRouter.post("/add", addUser);
userRouter.post("/login", login);

userRouter.post("/addTask", addTask);
userRouter.put("/updateTask", updateTask);
userRouter.delete("/deleteTask/:id", deleteTask);


userRouter.post("/logout", userLogout);



module.exports = userRouter;
