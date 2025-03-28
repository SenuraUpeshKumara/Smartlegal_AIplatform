import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  contactNo: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },


  password: {
    type: String,
    required: true,
  },

  role: {
    type: String,
    default: "admin",
  },

 
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel as User };
