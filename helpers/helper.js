const { isNull, isUndefined } = require("lodash");
const createError = require("http-errors");
const JWT = require("jsonwebtoken");

const UserModel = require("../Models/user.model");

const isDef = (param) => {
  if (isNull(param) || isUndefined(param)) {
    return false;
  } else {
    return true;
  }
};

const signAccessToken = async (userId) => {
  try {
    const payload = { userId: userId };
    const secret = process.env.SECRET;
    const options = {
      expiresIn: "1h",
      issuer: "tiger",
      audience: userId,
    };

    const token = JWT.sign(payload, secret, options);
    // console.log({ token });
    if (!isDef(token)) {
      throw createError.BadRequest("Token Error");
    }
    return token;
  } catch (error) {
    throw error;
  }
};

const isInstructor = async (req, res, next) => {
  try {
    const userId = req.decoded.userId;
    const user = await UserModel.findOne({ _id: userId, type: 1 });
    if (!isDef(user)) {
      throw createError.Unauthorized("Not authorized");
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isDef,
  signAccessToken,
  isInstructor,
};
