const express = require("express");
const port = 5000;
const server = express();
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const userRouter = require("./src/routes/user.routes");

dotenv.config();

server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(express.json());
server.use(cookieParser());

server.use("/user", userRouter);

mongoose.connect(process.env.DB_URL).then(() => {
  console.log("database connected succesfully");
});

server.listen(port, (err) => {
  console.log("server running..!!");
});
