import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import User, { IUser } from "../models/User";
import bcrypt from "bcrypt";
import passport from "passport";
import jwt, { JwtPayload } from "jsonwebtoken";
import { ObjectId } from "mongoose";

const generateAccessToken = (userId: string | ObjectId): string => {
  return jwt.sign(
    { id: userId },
    process.env.ACCESS_KEY ||
      "JSjXiPMVZXb0fWUVEu37PNgnDTe4to8tkvBrd0skpuQtEF12whjMjcUuTha88Qi1jax9adi61uf4K2yP",
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (userId: string | ObjectId): string => {
  return jwt.sign(
    { id: userId },
    process.env.REFRESH_KEY ||
      "5JKS8EsfAKPW99tqdzdIcSWZQKtCPlFaWnRbEkOraKEvV2GX8OI8pEUM9PItKUkArHlYsZkIRnZ6q4Oy",
    { expiresIn: "7d" }
  );
};

const userRegistrationController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  try {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.json({ message: "joi parsing error" });
    }
    const existingUser = await User.findOne({ email: value.email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }
    const hashedPassword = await bcrypt.hash(value.password, 10);
    const newUser = new User({
      name: value.name,
      email: value.email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "user registerd successfully" });
  } catch (error) {
    next(error);
  }
};

const userLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  try {
    const { error, value } = schema.validate(req.body);
    if (error) {
      return res.status(404).json({ message: "joi error " });
    }

    passport.authenticate(
      "local",
      async (err: any, user: any, info: { message: any }) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.status(401).json({ message: info.message });
        }
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken;
        await user.save();
        const currentDate = new Date();
        const accessTokenExpiration = currentDate.getTime() + 13 * 60 * 1000;
        const refreshTokenExpiration =
          currentDate.getTime() + (7 * 24 - 2) * 60 * 60 * 1000;
          user.password=undefined,
          user.refreshToken=undefined
        res
          .cookie("refreshToken", refreshToken, { httpOnly: true })
          .json({ accessToken, accessTokenExpiration, refreshTokenExpiration,user });
      }
    )(req, res, next);
  } catch (error) {
    next(error);
  }
};

const userRefreshTokenController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  });
  const { error, value } = schema.validate(req.cookies);
  if (error) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }
  const isRenewSchema = Joi.object({
    isRenew: Joi.boolean(),
  });
  const { error: renewError, value: renewValue } = isRenewSchema.validate(
    req.query
  );
  if (renewError) {
    return res.status(400).json({ message: "Invalid refresh token" });
  }

  try {
    const payload = jwt.verify(
      value.refreshToken,
      process.env.REFRESH_KEY ||
        "5JKS8EsfAKPW99tqdzdIcSWZQKtCPlFaWnRbEkOraKEvV2GX8OI8pEUM9PItKUkArHlYsZkIRnZ6q4Oy"
    ) as JwtPayload;
    if (typeof payload !== "string") {
      const user = await User.findById(payload.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Here you can generate a new access token and send it in the response
      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_KEY ||
          "JSjXiPMVZXb0fWUVEu37PNgnDTe4to8tkvBrd0skpuQtEF12whjMjcUuTha88Qi1jax9adi61uf4K2yP",
        { expiresIn: "15m" }
      );
      const currentDate = new Date();
      const accessTokenExpiration = currentDate.getTime() + 13 * 60 * 1000;
      if (renewValue.isRenew) {
        const refreshToken = jwt.sign(
          { id: user._id },
          process.env.REFRESH_KEY ||
            "5JKS8EsfAKPW99tqdzdIcSWZQKtCPlFaWnRbEkOraKEvV2GX8OI8pEUM9PItKUkArHlYsZkIRnZ6q4Oy",
          { expiresIn: "7d" }
        );
        user.refreshToken = refreshToken;
        await user.save();
        const refreshTokenExpiration =
          currentDate.getTime() + (7 * 24 - 2) * 60 * 60 * 1000;
        return res
          .cookie("refreshToken", refreshToken, { httpOnly: true })
          .json({ accessToken, accessTokenExpiration, refreshTokenExpiration });
      }
      res.json({ accessToken, accessTokenExpiration });
    } else {
      return res.json({ message: "Refresh token is invalid" });
    }
  } catch (error) {
    next(error);
  }
};
const userLogoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required(),
  });
  try {
    const { error, value } = schema.validate(req.body);

    if (error) {
      return res.status(400).json({ message: "invalid token" });
    }
    const user = await User.findOne({ refreshToken: value.refreshToken });
    if (!user) {
      return res.status(404).json({ message: "no user found" });
    }
    user.refreshToken = null;
    await user.save();

    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    next(error);
  }
};

export {
  userRegistrationController,
  userLoginController,
  userRefreshTokenController,
  userLogoutController,
};
