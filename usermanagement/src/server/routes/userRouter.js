import express, { response } from "express";
import bcrypt from "bcryptjs";
import jwt, { decode } from "jsonwebtoken";
import { User } from "../models/userSchema.js";

import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sayuminelithma@gmail.com",
    pass: "xfzw rmmk lvrf xyve", // Make sure to use an environment variable for security
  },
});

router.post("/signup", async (req, res) => {
  const { name, contactNo, email, password, role } =
    req.body;

  // Ensure required fields are provided
  if (!name || !contactNo || !email || !password || !role) {
    return res
      .status(400)
      .json({
        message: "Name, ContactNo, Email, Password, and Role are required",
      });
  }



  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the User object
    const newUser = new User({
      name,
      contactNo,
      email,
      password: hashedPassword,
      role,
      ...(role === "customer" && { companyID }), // Include companyID for customers //customer // companyID
      ...(role === "engineer" && { categoryName }), // Include categoryName for engineers // engineer // categoryName
    });

    // Save the user
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, process.env.KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    console.log("Cookie set:", req.cookies.token); // Debugging
    

    // Send welcome email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "sayuminelithma@gmail.com",
        pass: "xfzw rmmk lvrf xyve",
      },
    });

    const mailOptions = {
      from: "sayuminelithma@gmail.com",
      to: email,

      subject: "Welcome!",
      text: `Hi ${name}, welcome to our website. Your account was created.
Your login credentials are:
Email: ${email}
Password: ${password}

Use these credentials to access our website. Thank you!`,
    };

    await transporter.sendMail(mailOptions);

    res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Hardcoded admin credentials
  const ADMIN_EMAIL = "admin@example.com";
  const ADMIN_PASSWORD = "Admin@123"; // Store securely in env variables in production

  try {
    // Check if login credentials match the hardcoded admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign({ id: "admin" }, process.env.KEY, {
        expiresIn: "7d",
      });

      res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });

      return res.json({
        success: true,
        role: "admin",
        message: "Admin login successful",
      });
    }

    // Check database for other users
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });

    res.json({
      success: true,
      role: user.role,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ success: true, message: "Logged Out" });
  } catch (err) {
    console.error("Error during logout:", err);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});


const userAuth = async (req, res, next) => {
  const { token } = req.cookies;
  //corrected
  console.log("Token from cookies:", token); // Log the token
  if (!token) {
    return res.json({ success: false, message: "Not Authorized! Login again" });
  }
  try {
    const tokenDecode = jwt.verify(token, process.env.KEY);
    console.log("Decoded token:", tokenDecode); // Log the decoded token
    if (tokenDecode.id) {
      req.body.userID = tokenDecode.id;
    } else {
      return res.json({
        success: false,
        message: "Not Authirized! Login again",
      });
    }
    next();
  } catch (err) {
    console.error("Token verification error:", err.message); // Log the error
    return res.json({ success: false, message: err.message });
  }
};

//

//
//send verify otp
router.post("/send-verify-OTP", userAuth, async (req, res) => {
  try {
    const { userID } = req.body;

    const user = await User.findById(userID);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOTP = OTP;
    user.verifyOTPexpireAt = Date.now() + 24 * 60 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: "sayuminelithma@gmail.com",
      to: user.email,
      subject: "Account verification OTP",
      text: `Your OTP is ${OTP}. Verify your account using this OTP.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Verification OTP sent on Email",
    });
  } catch (error) {
    console.error("Error", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// verifyToken.js (middleware)




//verify email using OTP
router.post("/verify-account", userAuth, async (req, res) => {
  const { userID, OTP } = req.body;

  if (!userID || !OTP) {
    return res.json({ success: false, message: "Missing Details" });
  }

  try {
    const user = await User.findById(userID);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.verifyOTP === "" || user.verifyOTP !== OTP) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.verifyOTPexpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP Expired" });
    }

    user.isAccountVerified = true;
    user.verifyOTP = "";
    user.verifyOTPexpireAt = 0;

    await user.save();
    return res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

//check if user is authenticated
router.get("/is-auth", userAuth, async (req, res) => {
  try {
    return res.json({ success: true, message: "User is authenticated" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
});

//send password reset OTP
router.post("/send-reset-OTP", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.json({ success: false, message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const OTP = String(Math.floor(100000 + Math.random() * 900000));

    user.ResetOTP = OTP;
    user.resetOTPexpireAt = Date.now() + 15 * 60 * 1000;

    await user.save();

    const mailOptions = {
      from: "sayuminelithma@gmail.com",
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for resetting your password is ${OTP}. Reset your Password using this OTP.`,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Password resetting OTP sent on Email",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
});

//reset user password
router.post("/reset-password", async (req, res) => {
  const { email, OTP, newPassword } = req.body;

  if (!email || !OTP || !newPassword) {
    return res.json({
      success: false,
      message: "Email, OTP and New Password are required",
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    if (user.ResetOTP === "" || user.ResetOTP !== OTP) {
      return res.json({ success: false, message: "Invalid OTP" });
    }

    if (user.resetOTPexpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP expired" });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashPassword;
    user.ResetOTP = "";
    user.resetOTPexpireAt = 0;

    await user.save();

    return res.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
});

//get user data
router.get("/data", userAuth, async (req, res) => {
  try {
    const { userID } = req.body;

    const user = await User.findById(userID);

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    res.json({
      success: true,
      userData: {
        id: user._id,
        name: user.name,
        contactNo: user.contactNo,
        email: user.email,
        isAccountVerified: user.isAccountVerified,
        verifyOTP: user.verifyOTP,
        role: user.role,
       // categoryName: user.categoryName,
      },
    });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
});



export default transporter;
export { router as UserRouter };
