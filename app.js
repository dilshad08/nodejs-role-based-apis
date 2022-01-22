const express = require('express');
const createError = require('http-errors');
const dotenv = require('dotenv').config();
const { isDef } = require('./helpers/helper');
const jwt = require('jsonwebtoken');


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize DB
require('./initDB')();

app.use('/auth', require('./Routes/auth.route'));

// verify token
app.use(async function (req, res, next) {

  let token = req.body.token || req.query.token || req.headers["x-access-token"];

  console.log({ token });

  if (isDef(token)) {
    try {

      // verifies secret and checks exp
      let decoded = jwt.verify(token, process.env.SECRET);
      console.log("decoded");
      console.log(decoded);

      // if everything is good, save to request for use in other routes
      req.decoded = decoded;

      if (decoded) {
        console.log("Authorization passed");
        return next();
      } else {
        throw createError.Unauthorized("Not authorized");
      }
    } catch (error) {
      if (error.name == "JsonWebTokenError" || "TokenExpiredError"){
        error.status = 401
      }
      return next(error);
    }
  } else {
    return next(createError.Unauthorized('Please provide access token'));
  }
});


app.use('/class', require('./Routes/class.route'));
app.use('/student', require('./Routes/student.route')); 

//404 handler and pass to error handler
app.use((req, res, next) => {
  /*
  const err = new Error('Not found');
  err.status = 404;
  next(err);
  */
  // You can use the above code if your not using the http-errors module
  next(createError(404, 'Not found'));
});

//Error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      message: err.message
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Server started on port ' + PORT + '...');
});
