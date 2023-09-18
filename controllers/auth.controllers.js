const AppError = require("../helpers/appError");
const catchAsync = require("../helpers/catchAsync");
const { generateJWT } = require("../helpers/jwt");
const  Users  = require("../models/users.models");
const bcrypt = require("bcryptjs");

const createUser = catchAsync(async (req, res, next) => {

    const { name, lastname, email, password } = req.body;
  
    const user = new Users({
      name: name.toLowerCase().trim(),
      lastname: lastname.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      password,
    });
  
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
  
    await user.save();
  
    const token = await generateJWT(user.id);

    await user.save();
  
    res.status(201).json({
      status: 'success',
      message: 'El usuario ha sido creado correctamente',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
        role: user.role,
      },
    });
  });

  
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const { user } = req;
  
    if (!user) {
      return next(new AppError('El usuario no ha sido encontrado', 404));
    }
  
    if (!(await bcrypt.compare(password, user.password))) {
      return next(new AppError('Email or password incorrect', 401));
    }

    await user.save();
  
    const token = await generateJWT(user.id);
  
    res.status(200).json({
      status: 'success',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        lastname: user.lastname,
      },
    });
  });
  
  const renewToken = catchAsync(async (req, res, next) => {
    const { sessionUser } = req;
  
    const token = await generateJWT(sessionUser.id);

    const user = await Users.findOne({
      where: {
        status: true,
        id,
      },
    });
  
    res.status(200).json({
      staus: 'success',
      token,
      user: {
        uid: sessionUser.id,
        email: sessionUser.email,
        name: sessionUser.name,
        lastname: sessionUser.lastname,
      },
    });
  });

  module.exports = {
    createUser,
    login,
    renewToken,
  }