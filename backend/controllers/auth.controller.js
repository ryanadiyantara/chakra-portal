import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

export const login = asyncHandler(async (req, res) => {
  const auth = req.body;

  if (!auth.email || !auth.user_password) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  const { email, user_password } = auth;
  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const match = await bcrypt.compare(user_password, foundUser.user_password);

  if (!match) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const accessToken = jwt.sign(
    {
      UserInfo: {
        pid: foundUser._id,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = jwt.sign({ email: foundUser.email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    success: true,
    accessToken: accessToken,
  });
});

export const refresh = async (req, res) => {
  const cookies = req.cookies;

  console.log(req.cookies);

  if (!cookies?.jwt) return res.status(401).json({ success: false, message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err.message);
        return res.status(403).json({ success: false, message: "Forbidden" });
      }

      const foundUser = await User.findOne({ email: decoded.email }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ accessToken });
    })
  );
};

export const logout = async (req, res) => {
  // const cookies = req.cookies;
  console.log(req.cookies);
  // if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: false });
  res.json({
    success: true,
    message: "Cookie cleared",
  });
};

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, message: "Please provide email" });
  }

  const foundUser = await User.findOne({ email }).exec();

  if (!foundUser) {
    return res.status(400).json({ success: false, message: "Email not found" });
  }

  const resetToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  foundUser.passwordResetToken = hashedToken;
  foundUser.passwordResetExpires = Date.now() + 3600000;
  await foundUser.save();

  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/auth/resetpassword?token=${resetToken}`;

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "adiyantararyan@gmail.com",
    to: email,
    subject: "Password Reset",
    html: `<p>You requested to reset your password.</p>
           <p>Click the link below to reset your password:</p>
           <a href="facebook.com">TEST FB</a>
           <a href="${resetURL}">${resetURL}</a>
           <p>If you didn't request this, please ignore this email.</p>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.status(200).json({
      success: true,
      message: "Reset link sent to email successfully",
    });
  } catch (error) {
    // Rollback
    foundUser.passwordResetToken = undefined;
    foundUser.passwordResetExpires = undefined;
    await foundUser.save();

    return res.status(500).json({
      success: false,
      message: "There was an error sending the email. Try again later.",
    });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  }).exec();

  if (!user) {
    return res.status(400).json({ success: false, message: "Token is invalid or expired" });
  }

  const hashedPwd = await bcrypt.hash("chakra1234", 10);
  user.user_password = hashedPwd;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  res.redirect("/login");
});
