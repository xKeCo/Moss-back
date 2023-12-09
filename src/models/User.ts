import { prop, getModelForClass, modelOptions, pre } from '@typegoose/typegoose';

import bcrypt from 'bcryptjs';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
@pre<User>('save', async function (next) {
  const user = this;

  if (!user.isModified('password')) return next();

  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(user.password, salt);

  next();
})
class User {
  @prop({ type: String, required: false, capitalize: true, maxlength: 50 })
  public name!: string;

  @prop({ type: String, required: true, trim: true, unique: true, lowercase: true })
  public username!: string;

  @prop({
    type: String,
    required: [true, 'Email is required.'],
    trim: true,
    unique: true,
    lowercase: true,
    match: [
      /^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/,
      'The email address is badly formatted.',
    ],
  })
  public email!: string;

  @prop({
    type: String,
    required: [true, 'Password is required.'],
    minlength: [7, 'Password must be at least 7 characters.'],
    select: false,
  })
  public password!: string;

  // @prop({
  //   type: String,
  //   required: [true, 'Role is required.'],
  //   enum: ['A', 'U'],
  //   default: 'U',
  //   uppercase: true,
  // })
  // public role!: 'A' | 'U';

  @prop({ type: String, required: true, lowercase: true })
  public photoURL!: string;
}

// Change _id to id
export const UserModel = getModelForClass(User);
