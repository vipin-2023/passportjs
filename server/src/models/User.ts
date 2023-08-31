import mongoose, { Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  refreshToken: string | null ;
}

const userSchema: Schema = new mongoose.Schema(
  {
    name: { type: String, require: true },
    email: { type: String, require: true ,unique:true},
    password: { type: String, require: true },
    refreshToken: { type: String , require: false },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
