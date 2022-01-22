const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const RoleSchema = new Schema({
  active: { type: Boolean, default: true },
  name: {type: String }
})

const Role = mongoose.model('Role', RoleSchema);
module.exports = Role;