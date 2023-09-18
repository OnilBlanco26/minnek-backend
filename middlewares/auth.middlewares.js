const AppError = require("../helpers/appError");
const catchAsync = require("../helpers/catchAsync");
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const { Users } = require("../models/users.models");

const protect = catchAsync(async (req, res, next) => {
    //Verificar que llega el token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return next(
        new AppError(
          'No estas logueado, porfavor logueate para obtener acceso',
          401
        )
      );
    }
  
    //Validar token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.SECRET_JWT_SEED
    );
  
    //Validar si existe el usuario
    const user = await Users.findOne({
      where: {
        id: decoded.id,
        status: true,
      },
    });
  
    if (!user) {
      return next(new AppError('No se ha encontrado el usuario', 404));
    }
    //Validar si el usuario a cambiado el password despues de que el token ha expirado
    if (user.passwordChangedAt) {
      const changedTimeStamp = parseInt(
        user.passwordChangedAt.getTime() / 1000,
        10
      );
      if (decoded.iat < changedTimeStamp) {
        return next(
          new AppError(
            'El usuario ha cambiado la clave recientemente, porfavor inicia sesion nuevamente'
          )
        );
      }
  
      if (decoded.exp < currentTimeStamp) {
        user.lastSessionOf = Date.now();
        await user.save();
        return next(
          new AppError(
            'El token ha expirado, porfavor inicia sesion nuevamente',
            401
          )
        );
      }
    }
    req.token = token;
    req.sessionUser = user;
    next();
  });
  
  const checkTokenExpiration = catchAsync(async (req, res, next) => {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.SECRET_JWT_SEED);
  
        // Verificar si el token ha expirado
        const currentTimestamp = Math.floor(Date.now() / 1000); // Obtiene la hora actual en segundos
        if (decoded.exp < currentTimestamp) {
            // Si el token ha expirado, se crea un nuevo token
            const newToken = await generateJWT(decoded.id);
    
            // Se envía el nuevo token en la respuesta
            res.status(200).json({
                status: 'success',
                token: newToken,
            });
            } else {
            // Si el token no ha expirado, se envía el token actual
            res.status(200).json({
                status: 'success',
                token,
            });
        }
      } catch (error) {
        // Manejo de errores si el token no es válido
        console.error('Error al verificar el token:', error);
      }
    }
  
    next();
  })


  
  
module.exports = {
    protect,
    checkTokenExpiration
}