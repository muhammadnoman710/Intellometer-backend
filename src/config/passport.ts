import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "./prisma";

// Configure Google OAuth2 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email found in Google profile"), undefined);
        }

        // Upsert user in database
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            provider: "GOOGLE",
            isVerified: true, // Google accounts are pre-verified
          },
          create: {
            email,
            password: null, // Explicit null instead of empty string
            provider: "GOOGLE",
            isVerified: true,
          },
        });

        // Return minimal user data (no sessions, just raw user object)
        return done(null, {
          id: user.id,
          email: user.email,
          provider: user.provider,
        });
      } catch (error) {
        console.error("Google OAuth error:", error);
        return done(error, undefined);
      }
    }
  )
);

// ⚡️ Removed serializeUser/deserializeUser (no sessions, JWT instead)

export default passport;
