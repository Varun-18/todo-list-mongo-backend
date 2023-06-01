const userModel = require("../schema/user.schema");
const taskModel = require("../schema/task.schema");
const { verifyPasswordService } = require("../services/bcrypt.services");

const addUserService = async (name, username, hashedPassword) => {
  try {
    const data = new userModel({
      name: name,
      username: username,
      password: hashedPassword,
    });
    await data.save();
    return { code: 200, message: "new user added" };
  } catch (error) {
    throw { code: 400, message: "can't add user right now" };
  }
};

const loginService = async (username, password) => {
  try {
    const usernameCheck = await userModel.find({ username: username });
    if (usernameCheck.length > 0) {
      const passwordCheck = await verifyPasswordService(
        password,
        usernameCheck[0].password
      );
      if (passwordCheck) {
        const data = await getTaskService(username);
        return data;
      } else {
        throw { code: 401, message: "password does not match" };
      }
    } else {
      throw { code: 401, message: "username does not match" };
    }
  } catch (error) {
    throw error;
  }
};

const getSelectiveDataService = async (username) => {
  try {
    const data = await userModel.find({ username: username });
    return data;
  } catch (error) {
    throw { code: 400, message: "could not the the user data" };
  }
};

const getTaskService = async (username) => {
  try {
    const data = await taskModel.find({ username: username });
    return data;
  } catch (error) {
    throw {
      code: 400,
      message: "could not fetch data from the getTaskService",
    };
  }
};

const addTaskService = async (username, title, task) => {
  try {
    const existing = await taskModel.find({ username: username });
    if (existing.length === 0) {
      const data = new taskModel({
        username: username,
        todos: [
          {
            title: title,
            description: task,
            status: false,
          },
        ],
      });
      await data.save();
    } else {
      const data = await taskModel.findOneAndUpdate(
        { username: username },
        {
          $push: {
            todos: { title: title, description: task, status: false },
          },
        }
      );
    }
    const response = await getTaskService(username);
    return response;
  } catch (error) {
    throw error;
  }
};

const updateTaskService = async (username, value, id) => {
  console.log(username, value, id, "from the updateTask service");
  try {
    await taskModel.updateOne(
      { username, "todos._id": id },
      {
        $set: { "todos.$.status": value },
      }
    );

    const response = await getTaskService(username);
    return response;
  } catch (error) {
    throw { code: 500, message: "can't update the status" };
  }
};

const deleteTaskService = async (username, id) => {
  console.log(username, id);
  try {
    await taskModel.findOneAndUpdate(
      { username: username },
      {
        $pull: {
          todos: { _id: id },
        },
      }
    );
    const data = await getTaskService(username);
    return data;
  } catch (error) {
    throw { code: 500, message: "cannot delete the task" };
  }
};

module.exports = {
  addUserService,
  loginService,
  getSelectiveDataService,
  addTaskService,
  getTaskService,
  deleteTaskService,
  updateTaskService,
};
