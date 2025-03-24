import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  clientname: {
    type: String,
    required: true,
  },

  clientage: {
    type: String,
    required: true,
    unique: true,
  
  },

  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/.+\@.+\..+/, "Invalid email format"],
  },


  pname: {
    type: String,
    required: true,
    minlength: 6,
  },

  evidences: {
    type: String,
    required:true,
  },


 
});

const UserModel = mongoose.model("User", UserSchema);

export { UserModel as User };
