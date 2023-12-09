/*
    User Routes / Auth
    host + /api/auth
 */

// Express
import express from 'express';

// Validators
import { check } from 'express-validator';
import { fieldValidators } from '../middlewares/fieldValidators';
import { jwtValidator } from '../middlewares/jwtValidator';

// Controllers (functions)
import {
  changeUserPassword,
  getUserByUsername,
  updateUser,
  userLogin,
  userRegister,
} from '../controllers/auth';

const router = express.Router();

// @route   POST api/auth - Register
router.post('/new', userRegister);

// @route  POST api/auth - Login
router.post(
  '/login',
  [
    // Middlewares
    check('email', 'El email es requerido').isEmail(),
    check('password', 'La contraseña es requerida').not().isEmpty(),
    fieldValidators,
  ],
  userLogin
);

// @route   PUT api/auth - Update user
router.put('/update/:uid', jwtValidator, updateUser);

// @route
router.put(
  '/change-password/:uid',
  [
    // Middlewares
    check('password', 'La contraseña es requerida').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({
      min: 6,
    }),
    fieldValidators,
  ],
  changeUserPassword
);

// @route  GET api/auth - Get user by username
router.get('/:username', getUserByUsername);

export default router;
