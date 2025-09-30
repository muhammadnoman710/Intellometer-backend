import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import prisma from './prisma';

// Configure Google OAuth2 Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        
        if (!email) {
          return done(new Error('No email found in Google profile'), undefined);
        }

        // Upsert user in database
        const user = await prisma.user.upsert({
          where: { email },
          update: {
            provider: 'GOOGLE',
            isVerified: true, // Google accounts are pre-verified
          },
          create: {
            email,
            password: '', // No password for OAuth users
            provider: 'GOOGLE',
            isVerified: true,
          },
        });

        // Return user data
        return done(null, {
          id: user.id,
          email: user.email,
          provider: user.provider,
        });
      } catch (error) {
        console.error('Google OAuth error:', error);
        return done(error, undefined);
      }
    }
  )
);

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, provider: true },
    });
    
    if (!user) {
      return done(new Error('User not found'), null);
    }
    
    done(null, user);
  } catch (error) {
    console.error('Deserialize user error:', error);
    done(error, null);
  }
});

export default passport;