import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/user.model.js";

export const login = asyncHandler(async (req, res) => {
  const auth = req.body;

  if (!auth.email || !auth.user_password) {
    return res.status(400).json({ success: false, message: "Please provide all fields" });
  }

  const { email, user_password } = auth;

  const foundUser = await User.findOne({ email }).exec();

  //   if (!foundUser || foundUser.na) {
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
        email: foundUser.email,
      },
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1m" }
  );

  const refreshToken = jwt.sign({ email: foundUser.email }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "1d",
  });

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, // accessible only by web server
    secure: false, // https
    sameSite: "None", // cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: set to match rT
  });

  // Send accessToken containing email
  res.json({ accessToken });
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
        return res.status(403).json({ success: false, message: "Forbidden controller" });
      }

      const foundUser = await User.findOne({ email: decoded.email }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized b" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            email: foundUser.email,
          },
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    })
  );
};

export const logout = async (req, res) => {
  const cookies = req.cookies;
  console.log(req.cookies);
  if (!cookies?.jwt) return res.sendStatus(204); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "Cookie cleared" });
};