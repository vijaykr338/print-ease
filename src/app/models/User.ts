import mongoose, { Schema, Document } from "mongoose";

export interface User extends Document {
  userID: string;
  name: string;
  email: string;
  image: string;
  rollNo?: string;
}

const UserSchema: Schema<User> = new Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  image: {
    type: String,
  },
  rollNo: {
    type: String,
    required: true,
  },
});

const UserModel = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", UserSchema);

export default UserModel;