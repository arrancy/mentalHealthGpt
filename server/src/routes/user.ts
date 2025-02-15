import express, { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { usersTable } from "./../db/schema";
import { db } from "..";
import { signupSchema } from "./../zodTypes/zodSignupSchema";
import { signinSchema } from "./../zodTypes/zodSigninSchema";
import { isLoggedIn } from "../auth/authMiddleware";

export const userRouter = Router();
userRouter.use(express.json());

userRouter.post("/signup", async (req: Request, res: Response) => {
  const reqBody = req.body;
  const { success } = signupSchema.safeParse(req.body);
  if (!success) {
    res.status(400).json({ msg: "invalid inputs" });
    return;
  }
  const { name, email, password } = reqBody;

  const existingUser = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });
  if (existingUser) {
    res.status(400).json({ msg: "user already exists" });
    return;
  }
  bcrypt.hash(password, 10, async (err, hash) => {
    if (!hash) {
      res.status(500).json({ msg: "internal server error" });
      throw err;
    }

    const newUserObject = { name, email, password: hash, isOauth: false };
    try {
      const newUserResult = await db
        .insert(usersTable)
        .values(newUserObject)
        .returning();
      if (!newUserResult) {
        res.status(500).json({ msg: "internal server error" });
        return;
      }

      const userId = newUserResult[0].id;
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        res.status(500).json({ msg: "internal server error" });
        return;
      }

      const token = jwt.sign({ id: userId }, JWT_SECRET);
      res.status(200).json({ msg: "signed up successfully", token });
    } catch (error) {
      res.status(500).json({ msg: "internal server error" });
      return;
    }
  });
});
userRouter.post("/signin", async (req: Request, res: Response) => {
  const reqBody = req.body;

  const { success } = signinSchema.safeParse(reqBody);
  if (!success) {
    res.status(401).json({ msg: "invalid inputs" });
    return;
  }

  const { email, password } = reqBody;

  const userExists = await db.query.usersTable.findFirst({
    where: (table, { eq }) => eq(table.email, email),
  });

  if (!userExists) {
    res.status(401).json({ msg: "invalid credentials" });
    return;
  }
  if (!userExists.password) {
    // this is to check if someone who has signed up with oauth is trying to sign in normally.
    res.status(401).json({ msg: "invalid credentials" });
    return;
  }
  bcrypt.compare(password, userExists.password, async (err, result) => {
    if (!result) {
      res.status(401).json({ msg: "invalid credentials 1" });
      return;
    }
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      res.status(500).json({ msg: "internal server error" });
      return;
    }
    const { id } = userExists;
    try {
      const token = jwt.sign({ id }, JWT_SECRET);
      res.status(200).json({ token, msg: "signed in successfully" });
    } catch (error) {
      res.status(500).json({ msg: "internal server error " });
      console.log(error);
    }
  });
});

userRouter.post(
  "/logout",
  isLoggedIn,
  async (req: Request, res: Response, next: NextFunction) => {
    console.log("reaches the logout request handler");

    if (req.session) {
      req.logout((err) => {
        if (err) return next(err);

        req.session.destroy((err) => {
          // No ! needed here
          if (err) return next(err);

          res.clearCookie("connect.sid");
          res.status(200).json({ message: "Logged out successfully" });
        });
      });
    } else {
      res.status(200).json({ message: "Logged out successfully" });
    }
  }
);
