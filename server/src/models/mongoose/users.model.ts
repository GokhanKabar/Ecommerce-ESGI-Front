import { model, Schema, Document } from 'mongoose';

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastname: { 
    type: String,
    required: true,
  },
});

export const UserModel = model<Document>('User', UserSchema);