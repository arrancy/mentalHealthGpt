import express, { NextFunction, Request, Response, Router } from "express";
import passport, { authenticate } from "passport";
import cors from "cors";
import { drizzle } from "drizzle-orm/neon-http";
import session from "express-session";
import { userRouter } from "./routes/user";
import * as schema from "./db/schema";
import "dotenv/config";
import "./auth/auth";
import { isLoggedIn } from "./auth/authMiddleware";
import { CustomRequest } from "./auth/auth";
import { chatRouter } from "./routes/chat";
const DATABASE_URL = process.env.DATABASE_URL;
const SESSION_SECRET = process.env.SESSION_SECRET;

if (!SESSION_SECRET) {
  throw new Error("SESSION SECRET is not defined in the environment variables");
}

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in the environment variables");
}
export const db = drizzle(DATABASE_URL, { schema });

const app = express();
app.use(cors({ origin: "https://helpmymind.tech", credentials: true }));

app.use(
  session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/user", userRouter);
app.use("/chat", chatRouter);
// type ReqBody = z.infer<typeof signupSchema>; // deemed this line of code to be useless here because while request testing the code does reach the invalid inputs thing without breaking, so that is the only input validation we need, z.infer for now, we will only think that it will be used in monorepos where we want to share the types across the monorepo from the backend to the frontend
app.get("/", (req, res) => {
  res.send('<a href="/auth/google">Authenticate with Google</a>');
});

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);
app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/protected",
    failureRedirect: "/auth/google/failure",
  })
);

app.get("/protected", isLoggedIn, (req: Request, res: Response) => {
  const newReq = req as CustomRequest;
  console.log(newReq.user);
  res.redirect("https://helpmymind.tech/dashboard");
  // res.send(`Hello ${newReq.user}`);
});
app.get("/me", isLoggedIn, (req: Request, res: Response) => {
  console.log("reached here");
  res.status(200).json({ msg: "user is authorized", authenticated: true });
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ msg: "Internal Server Error!" });
});

const PORT = process.env.port || 4000;
app.listen(PORT, () => {
  console.log("listening on " + PORT);
});

// if oauth sign up then jwt sign in password null so would not log in
// if jwt sign up , oauth sign in then okayy that is okaayy
// if oauth sign up, and then jwt sign up, that should not work right, obviously because user does not exists will get triggered
