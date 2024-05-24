import mongoose from "mongoose";
import {
  USEREMAIL_LEN,
  USEREMAIL_MIN_LEN,
  USERNAME_LEN,
  USERNAME_MIN_LEN,
  PASSWORD_LEN,
  PASSWORD_MIN_LEN,
} from "../../constants/AuthValidation.js";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: USERNAME_MIN_LEN,
    maxlength: USERNAME_LEN,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: USEREMAIL_MIN_LEN,
    maxlength: USEREMAIL_LEN,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
