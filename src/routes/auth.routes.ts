import { Router } from "express";
import { body } from "express-validator";
import passport from "passport";
import jwt from "jsonwebtoken";
import { signupHandler } from "../controllers/auth.controller";
import { verifyOtp } from "../controllers/verifyOtp.controller";
import { login } from "../controllers/login.controller";
import { refreshTokenHandler } from "../controllers/refreshToken.controller";
import { logout } from "../controllers/logout.controller";
import { forgotPassword } from "../controllers/forgotPassword.controller";
import { resetPassword } from "../controllers/resetPassword.controller";

const router = Router();

/**
 * Utility: generate JWT
 */
function generateJwt(user: { id: number; email: string; provider: string }) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      provider: user.provider,
    },
    process.env.JWT_SECRET!, // make sure JWT_SECRET exists in .env
    { expiresIn: "7d" }
  );
}

/**
 * POST /auth/signup
 * body: { email, password }
 */
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  signupHandler
);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Login
router.post("/login", login);

// Refresh token
router.post("/refresh", refreshTokenHandler);

// Logout
router.post("/logout", logout);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Google OAuth callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/auth/login?error=google_failed" }),
  (req, res) => {
    const user = req.user as { id: number; email: string; provider: string };

    if (!user) {
      return res.redirect("/auth/login?error=no_user");
    }

    // Forgot password
    router.post("/forgot-password", forgotPassword);

    // Reset password
    router.post("/reset-password", resetPassword);


    // Generate JWT
    const token = generateJwt(user);

    // ✅ Option 1: Send JSON response (for API/Mobile)
    return res.json({ token, user });

    // ✅ Option 2: Redirect to frontend with token in query (if SPA)
    // return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

export default router;
