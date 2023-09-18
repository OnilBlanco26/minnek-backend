const { Router } = require("express");
const { check } = require("express-validator");
const { validateFields } = require("../middlewares/validateFields.middlwares");
const { createUser, login, renewToken } = require("../controllers/auth.controllers");
const { validateUserByEmail, validateIfExistUserByEmail, validateEmail } = require("../middlewares/users.middlewares");
const { protect } = require("../middlewares/auth.middlewares");


const router = Router()

router.post('/signup', [
    check('name', 'The name is required').not().isEmpty(),
    check('lastname', 'The lastname is required').not().isEmpty(),
    check('email', 'The email is required').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    validateFields,
    validateUserByEmail
], createUser)

router.post('/login', [
    check('email', 'The email is required').isEmail(),
    check('password', 'The password is required').not().isEmpty(),
    validateFields,
    validateEmail
] , login)

router.use(protect);

router.get('/renew', renewToken);

module.exports = {
    authRouter: router
}