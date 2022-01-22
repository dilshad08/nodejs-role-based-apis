const createError = require("http-errors");
const UserModel = require("../Models/user.model");
const ClassModel = require("../Models/class.model");
const { isDef } = require("../helpers/helper");
const { isValidObjectId } = require("mongoose");
const { isEmpty } = require("lodash");
const { deleteClass } = require("./class.controller");

module.exports = {
  getStudent: async (req, res, next) => {
    try {
      const student = await UserModel.find({ type: 2 });
      // const  = await UserModel.find({
      //   class: { $elemMatch: { $eq: classId } },
      // });
      if (isEmpty(student)) {
        throw createError.BadRequest("No student found");
      }
      res.send(student);
    } catch (error) {
      next(error);
    }
  },

  postStudent: async (req, res, next) => {
    try {
      const { studentId, classId } = req.body;
      if (!isDef(studentId) || !isValidObjectId(studentId)) {
        throw createError.BadRequest("Not a valid Id");
      }
      if (!isDef(classId) || !isValidObjectId(classId)) {
        throw createError.BadRequest("Not a valid Id");
      }
      const student = await UserModel.findOne({ _id: studentId, type: 2 });
      if (!isDef(student)) {
        throw createError.Conflict("No Student Found");
      }

      const instructorId = req.decoded.userId;

      const isInstructor = await ClassModel.findOne({
        _id: classId,
        instructor: instructorId,
      });
      if (!isDef(isInstructor)) {
        throw createError.Unauthorized(
          "You are not the instructor of this course"
        );
      }
      const alreadyEnrolled = await UserModel.find({
        class: { $elemMatch: { $eq: classId } },
      });

      if (!isEmpty(alreadyEnrolled)) {
        throw createError.Conflict("User already enrolled");
      }
      student.class.push(classId);
      const saveStudent = await student.save();
      if (!saveStudent) {
        throw createError.UnprocessableEntity("Something went wrong");
      }
      res.send(saveStudent);
    } catch (error) {
      next(error);
    }
  },

  deleteStudent: async (req, res, next) => {
    try {
      const { studentId, classId } = req.body;
      if (!isDef(studentId) || !isValidObjectId(studentId)) {
        throw createError.BadRequest("Not a valid Id");
      }
      if (!isDef(classId) || !isValidObjectId(classId)) {
        throw createError.BadRequest("Not a valid Id");
      }
      const student = await UserModel.findOne({
        _id: studentId,
        type: 2,
      }).select("-password");
      if (!isDef(student)) {
        throw createError.Conflict("No Student Found");
      }

      const instructorId = req.decoded.userId;

      const isInstructor = await ClassModel.findOne({
        _id: classId,
        instructor: instructorId,
      });
      if (!isDef(isInstructor)) {
        throw createError.Unauthorized(
          "You are not the instructor of this course"
        );
      }
      const alreadyEnrolled = await UserModel.find({
        class: { $elemMatch: { $eq: classId } },
      });

      if (isEmpty(alreadyEnrolled)) {
        throw createError.Conflict("User not enrolled in this class");
      }
      student.class.pull(classId);
      const deletedClass = await student.save();

      if (!deleteClass) {
        throw createError.UnprocessableEntity("Something went wrongs");
      }
      res.send(deletedClass);
    } catch (error) {
      next(error);
    }
  },
};
