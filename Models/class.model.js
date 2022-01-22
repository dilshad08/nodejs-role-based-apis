const { Schema, Types, model } = require("mongoose");
const { ObjectId } = Types;
const User = require("./user.model");

const ClassSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  instructor: {
    type: ObjectId,
    ref: "User",
  },
});

const Class = model("Class", ClassSchema);
module.exports = Class;
