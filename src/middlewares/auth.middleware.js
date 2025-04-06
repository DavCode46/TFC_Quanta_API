import jwt from 'jsonwebtoken';
import ErrorModel from '../models/Error.model.js';

const authenticate = (req, res, next ) => {
  const Authorization = req.headers.Authorization || req.headers.authorization;
  if(Authorization && Authorization.startsWith('Bearer')) {
    const token = Authorization.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, info) => {
      if(error) {
        return next(new ErrorModel('No autorizado', 403));
      }else {
        req.user = info;
        next();
      }
    })

  } else {
    return next(new ErrorModel('No autorizado', 403));
  }
}

export default authenticate;
