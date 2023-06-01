const bcrypt = require("bcrypt");

const genrateHashedPass = async (password) => {
  try {
    const hashedPass = await bcrypt.hash(password, 8);
    return hashedPass;
  } catch (error) {
    throw { code: 500, message: "Can't genrate hashed password" };
  }
};

const verifyPasswordService = async (userPassword, dbPassword) => {
    try {
        const result = await bcrypt.compare(userPassword, dbPassword)
        return result 
    } catch (error) {
        throw {code : 500, message : "couldnot verify the password"}
    }
}

module.exports = { genrateHashedPass, verifyPasswordService };
