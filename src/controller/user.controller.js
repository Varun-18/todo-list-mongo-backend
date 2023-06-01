const jwt = require("jsonwebtoken");
const {
  addUserService,
  loginService,
  getSelectiveDataService,
  getTaskService,
  addTaskService,
  updateTaskService,
  deleteTaskService,
} = require("../services/user.services");
const { genrateHashedPass } = require("../services/bcrypt.services");

const addUser = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const hashedPassword = await genrateHashedPass(password);
    const data = await addUserService(name, username, hashedPassword);
    res.status(data.code).send(data.message);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await loginService(username, password);
    if (result) {
      const token = jwt.sign({ username: username }, process.env.KEY);
      res
        .status(200)
        .cookie("authToken", token, {sameSite:"none", httpOnly: true, secure: true })
        .send(result);
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const authenticateUser = async (req, res) => {
  const token = req.cookies.authToken;
  if (token) {
    try {
      const result = jwt.verify(token, process.env.KEY);
      console.log(result);
      // const data = await getSelectiveDataService(result.username);
      const data = await getTaskService(result.username);
      res.status(200).send(data);
    } catch (error) {
      console.log(error, "from the authenticate user");
      res.status(error.code).send(error.message);
    }
  } else {
    res.status(404).send("no token found");
  }
};

const addTask = async (req, res) => {
  const { title, task } = req.body;
  const token = req.cookies.authToken;
  console.log(title, task);
  try {
    const { username } = jwt.verify(token, process.env.KEY);
    const data = await addTaskService(username, title, task);
    res.status(200).send(data);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
};

const updateTask = async (req, res) => {
  const token = req.cookies.authToken;
  const { value, id } = req.body;
  try {
    const { username } = jwt.verify(token, process.env.KEY);
    console.log(username);
    const data = await updateTaskService(username, value, id);
    res.status(200).send(data);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
};

const deleteTask = async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.authToken;
  try {
    const { username } = jwt.verify(token, process.env.KEY);
    const data = await deleteTaskService(username, id);
    res.status(200).send(data);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
};

const userLogout = (req, res) => {
  try {
    res.clearCookie("authToken",{sameSite:"none", httpOnly: true, secure: true }).send(false);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addUser,
  login,
  authenticateUser,
  addTask,
  deleteTask,
  updateTask,
  userLogout,
};
