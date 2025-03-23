import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  contactNo: {
    type: String,
    required: true,
    unique: true,
    match: [
      /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{3}$/,
      "Invalid contact number format",
    ], // Ensure last part has 3 digits +91 987 654 321
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, "Invalid email format"],
  },


  password: {
    type: String,
    required: true,
    minlength: 6,
  },

  role: {
    type: String,
    default: "customer",
  },


 
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel as User };
