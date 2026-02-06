import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,   // ensures email is unique
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  userName:{
    type:String,
    required:true
  }
});

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return; // only hash if password changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});


const User = mongoose.model("User", userSchema);

export default User;
