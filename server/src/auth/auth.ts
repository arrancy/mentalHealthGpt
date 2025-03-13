import passport, { DoneCallback, Profile } from "passport";
import { Request } from "express";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import "dotenv/config";
import { db } from "../index";
import { usersTable } from "../db/schema";
import { eq } from "drizzle-orm";

declare global {
  namespace Express {
    interface User {
      id: number;
    }
  }
}

if (!process.env.CLIENT_ID || !process.env.CLIENT_SECRET) {
  throw new Error(
    "Google Client ID and Secret must be defined in environment variables."
  );
}
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "https://api.helpmymind.tech/auth/google/callback",
      passReqToCallback: true,
    },
    async function (
      req: Request,
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: DoneCallback
      // cb: (err: unknown, user) => void
    ) {
      // User.findOrCreate({ exampleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });

      try {
        if (!profile.emails) {
          return done(new Error("Authentication failed"));
        }

        const userEmail = profile.emails[0].value;
        const nameOfUsername = profile.displayName;

        const existingUser = await db.query.usersTable.findFirst({
          where: (table, { eq }) => eq(table.email, userEmail),
        });

        if (!existingUser) {
          const newUserResult = await db
            .insert(usersTable)
            .values({ name: nameOfUsername, email: userEmail })
            .returning();

          return done(null, newUserResult[0]);
        }
        const updatedUser = await db
          .update(usersTable)
          .set({ isOauth: true })
          .where(eq(usersTable.email, existingUser.email))
          .returning();

        done(null, updatedUser[0]);
      } catch (error) {
        return done(
          error instanceof Error ? error : new Error("Authentication failed")
        );
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id: number, done) => {
  done(null, { id: id });
});

export interface CustomRequest extends Request {
  user: Express.User;
}
