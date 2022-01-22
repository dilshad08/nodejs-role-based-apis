const router = require('express').Router();
const AuthController = require('../Controllers/auth.controller');



router.post('/login', AuthController.postLogin)

router.post('/register', AuthController.postRegister)

router.post('/role', AuthController.postRole)

module.exports = router