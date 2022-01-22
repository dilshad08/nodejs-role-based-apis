const { Schema, Types, model } = require("mongoose");
const { ObjectId } = Types;

const Role = require("./role.model");
const Class = require("./class.model");

const bcrypt = require("bcrypt");
const mongooseDelete = require("mongoose-delete");

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  type: {
    type: Number,
    required: true, // 1 for INSTRUCTOR 2 for STUDENT
  },

  password: {
    type: String,
    required: true,
  },

  class: [
    {
      type: ObjectId,
      ref: "Class",
    },
  ],

  role: {
    type: ObjectId,
    ref: "Role",
    required: true,
  },

  deleted: {
    type: Boolean,
    default: false,
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isNew) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(this.password, salt);
      this.password = hashedPassword;
    }

    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.method("comparePassword", function (password) {
  if (bcrypt.compareSync(password, this.password)) {
    return true;
  } else {
    return false;
  }
});

UserSchema.plugin(mongooseDelete, { overrideMethods: true });
UserSchema.plugin(mongooseDelete, {
  deleted: false,
  overrideMethods: ["find"],
});

const User = model("User", UserSchema);
module.exports = User;
