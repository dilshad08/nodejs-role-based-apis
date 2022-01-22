const createError = require("http-errors");
const ClassModel = require("../Models/class.model");
const UserModel = require("../Models/user.model");
const { isDef } = require("../helpers/helper");
const { isEmpty, isString, size } = require("lodash");
const { isValidObjectId } = require("mongoose");

module.exports = {
  getClass: async (req, res, next) => {
    try {
      const id = req.decoded.userId;
      const enrolledIn = await UserModel.findOne({ _id: id, type: 2 }).populate(
        "class"
      );

      if (isEmpty(enrolledIn)) {
        throw createError.BadRequest("No Studnet Found");
      }

      res.send(enrolledIn);
    } catch (error) {
      next(error);
    }
  },

  postClass: async (req, res, next) => {
    try {
      const { name } = req.body;

      if (!isDef(name) || isEmpty(name)) {
        throw createError.BadRequest("Name required");
      }

      const user = req.decoded.userId;

      if (!isValidObjectId(user)) {
        throw createError.BadRequest("Not a valid ID");
      }
      // console.log(req.decoded);

      const addClass = new ClassModel({ name, instructor: user });

      const savedClass = await addClass.save();
      if (!isDef(savedClass)) {
        throw createError(500, "Something went wrong");
      }

      res.send(savedClass);
    } catch (error) {
      next(error);
    }
  },

  patchClass: async (req, res, next) => {
    try {
      const id = req.params.id;
      const updates = req.body;
      const options = { new: true };
      console.log(id);

      if (!isDef(id) || !isValidObjectId(id) || isEmpty(id)) {
        throw createError.BadRequest("Not a vaid ID");
      }

      let updateUser = {};
      if (isDef(updates.name)) {
        if (isEmpty(updates.name) || !isString(updates.name)) {
          throw createError(400, "Class name required");
        } else {
          updateUser = {
            ...updateUser,
            name: updates.name,
          };
        }
      }

      if (size(updateUser) <= 0) {
        throw createError.BadRequest("Data required");
      }

      const result = await ClassModel.findByIdAndUpdate(
        { _id: id },

        {
          ...updateUser,
        },
        options
      );

      if (!isDef(result)) {
        throw createError(404, "Class not found");
      }
      res.send(result);
    } catch (error) {
      next(error);
    }
  },

  deleteClass: async (req, res, next) => {
    try {
    } catch (error) {
      next(error);
    }
  },
};
