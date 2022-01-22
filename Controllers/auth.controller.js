const createError = require('http-errors');
const { registerSchema, loginSchema } = require('../helpers/validation');
const User = require('../Models/user.model');
const Role = require('../Models/role.model');
const { isDef, signAccessToken } = require('../helpers/helper');



module.exports = {

  // User Login Controller

  postLogin: async (req, res, next) => {


    try {

      // validating inputs
      const result = await loginSchema.validateAsync(req.body);

      // check whether user exists
      const user = await User.findOne({
        email: result.email
      });

      if(!isDef(user)){
        throw createError.Unauthorized('Wrong Email/Password')
      }

      //check for password match
      const isValidPassword = await user.comparePassword(result.password);
      if(!isValidPassword){
        throw createError.Unauthorized('Wrong Email/Password compare')
      }

      // if user provides valid credentials
      // providing access token
      const accessToken = await signAccessToken(user._id.toString());
      if (!isDef(accessToken)) {
        throw createError.BadRequest("Something went wrong");
      }
      // console.log(accessToken);

      res.send({accessToken})
     
    } catch (error) {
      if(error.isJoi === true) error.status = 422
      next(error)
    }
  },


  // User registration controller

  postRegister: async (req, res, next) => {
    try {

      // validating inputs
      const result = await registerSchema.validateAsync(req.body);


      // check whether user already exists
      const doesExist = await User.findOne({email: result.email});

      if(doesExist){
        throw createError.Conflict('User already exists');
      }

      const user = new User(result);
      const createdUser = await user.save();
      if(!isDef(createdUser)){
        throw createError(500, 'Internal server error')
      }

      res.send(createdUser);

    } catch (error) {
      //check for joi error
      if(error.isJoi === true) error.status = 422
      next(error)
    }
  },

  postRole : async (req, res, next) => {

    try {

      let name = "STUDENT"
      const role = new Role({name})
      await role.save();
      res.send(role);
      
    } catch (error) {
      next(error)
    }

  }

};
