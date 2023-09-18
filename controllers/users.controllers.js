const Users = require('../models/users.models');
const catchAsync = require('../helpers/catchAsync');

const findUsers = catchAsync(async (req, res, next) => {
  const users = await Users.findAll({
    where: {
      status: true,
    },
  });

  if (!users || users.length === 0) {
    return res.status(404).json({
      status: 'Error',
      message: 'No registered users found',
    });
  }

  res.status(201).json({
    status: 'success',
    message: 'List of found users',
    data: {
      users,
    },
  });
});

const findUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  res.status(201).json({
    status: 'success',
    message: 'User successfully found',
    data: {
      user,
    },
  });
});

const updateUser = catchAsync(async (req, res, next) => {
  const { user } = req;
  const { name, lastname, email } = req.body;

  const updateUser = user.update({ name, lastname, email });

  res.status(200).json({
    status: 'success',
    message: 'The user has been successfully updated',
    updateUser,
  });
  next();
});

const deleteUser = catchAsync(async (req, res, next) => {
  const { user } = req;

  await user.update({ status: false });

  res.status(200).json({
    status: 'success',
    message: 'The user has been deleted',
  });

  next();
});

module.exports = {
  findUsers,
  findUser,
  updateUser,
  deleteUser,
};
