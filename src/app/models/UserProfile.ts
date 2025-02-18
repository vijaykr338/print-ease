import mongoose, { Schema, Document } from "mongoose";

export interface UserProfile extends Document {
  userID: string;
  name: string;
  rollNo: string;
}

const UserSchema: Schema<UserProfile> = new Schema({
  userID: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
  },
});

const UserProfileModel = (mongoose.models.User as mongoose.Model<UserProfile>) || mongoose.model<UserProfile>("User", UserSchema);

export default UserProfileModel;