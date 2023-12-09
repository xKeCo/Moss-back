import { request, response } from 'express';

// Password encryption
import bcrypt from 'bcryptjs';

// User model
import { UserModel } from '../models';

// Register user
export const userRegister = async (req = request, res = response) => {
  const { email, username } = req.body;

  try {
    let user = await UserModel.findOne({ $or: [{ email }, { username }] });

    if (user) {
      return res.status(400).json({
        ok: false,
        message: 'A user already exists with that email or username.',
      });
    }

    user = new UserModel(req.body);

    user.photoURL = `https://source.boringavatars.com/marble/50/${user.username}`;
    user.name = '';

    await user.save();

    res.status(201).json({
      ok: true,
      uid: user.id,
      user,
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: 'Error inesperado',
      errorMessage: error.message,
    });
  }
};

// Login user
export const userLogin = async (req = request, res = response) => {
  const { email, password } = req.body;

  try {
    let user = await UserModel.findOne({ email }).select('+password');

    if (!user) {
      return res.status(400).json({
        ok: false,
        message: 'El usuario no existe con ese correo institucional',
      });
    }

    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: 'The email or password are incorrect',
      });
    }

    user.password = '';

    res.json({
      ok: true,
      uid: user.id,
      user,
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: 'Error with the login, try again later',
      errorMessage: error.message,
    });
  }
};

// Update user information
export const updateUser = async (req = request, res = response) => {
  const { uid } = req.params;

  try {
    let user = await UserModel.findById(uid);

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'El usuario no existe',
      });
    }

    const newUser = {
      ...req.body,
    };

    const userUpdated = await UserModel.findByIdAndUpdate(uid, newUser, {
      new: true,
    });

    res.json({
      ok: true,
      user: userUpdated,
    });
  } catch (error: any) {
    console.log(error);
    res.status(500).json({
      ok: false,
      message:
        'Error actualizando la informacion del usuario, intente de nuevo mas tarde',
      errorMessage: error.message,
    });
  }
};

// Get user data by username
export const getUserByUsername = async (req = request, res = response) => {
  const { username } = req.params;

  try {
    const user = await UserModel.findOne({ username });

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'El usuario no existe',
      });
    }

    res.json({
      ok: true,
      user,
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: 'Error trayendo la informacion del usuario, intente de nuevo mas tarde',
      errorMessage: error.message,
    });
  }
};

// Change user password
export const changeUserPassword = async (req = request, res = response) => {
  const { uid } = req.params;
  const { password, newPassword, confirmNewPassword } = req.body;

  try {
    let user = await UserModel.findById(uid).select('+password');

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: 'El usuario no existe',
      });
    }

    // Confirm passwords
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        message: 'La contraseña es incorrecta',
      });
    }

    // Can't use the same password
    if (password === newPassword) {
      return res.status(400).json({
        ok: false,
        message: 'La nueva contraseña no puede ser igual a la anterior',
      });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({
        ok: false,
        message: 'Las contraseñas no coinciden',
      });
    }

    // Encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(newPassword, salt);

    await user.save();

    user.password = '';

    res.json({
      ok: true,
      message: 'Contraseña actualizada correctamente',
      user,
    });
  } catch (error: any) {
    console.log(error);

    res.status(500).json({
      ok: false,
      message: 'Error trayendo la informacion del usuario, intente de nuevo mas tarde',
      errorMessage: error.message,
    });
  }
};
