import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
  console.log("reached middleware");
  console.log(req.user);

  if (req.user) {
    console.log("reached first if check");
    console.log(req.user);

    return next();
  } else {
    try {
      console.log("reached else in authMiddleware");
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ msg: "invalid credentials" });
        return;
      }
      const token = authHeader.split(" ")[1];

      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        res.status(500).json({ msg: "internal server error" });
        return;
      }
      const jwtPayload = jwt.verify(token, JWT_SECRET);
      const userIdObject = jwtPayload as JwtPayload;
      const userId = userIdObject.id;
      req.user = { id: userId };

      return next();
    } catch (error) {
      res.status(401).json({ msg: "unauthenticated" });
      return;
    }
  }
}
