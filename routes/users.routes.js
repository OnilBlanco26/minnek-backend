const Router = require('express');

const { validateUserById } = require('../middlewares/users.middlewares');
const { check } = require('express-validator');
const {
  findUsers,
  findUser,
  updateUser,
  deleteUser,
} = require('../controllers/users.controllers');

const router = Router();

router.get('/', findUsers);

router.get('/:id', validateUserById, findUser);

router.patch('/:id', validateUserById, updateUser);

router.delete('/:id', validateUserById, deleteUser);

module.exports = {
  usersRouter: router,
};
