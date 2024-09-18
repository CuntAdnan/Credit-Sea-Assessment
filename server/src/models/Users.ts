import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;  
  dateCreated: Date;
  avatar?: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,  
  },
  email: {
    type: String,
    required: true,
    unique: true,  
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],  // Basic email validation
  },
  password: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,  
  },
  dateCreated: {
    type: Date,
    default: Date.now,  
  },
  avatar: {
    type: String, 
    default: '', 
  },
});

export const User = model<IUser>('User', userSchema);
