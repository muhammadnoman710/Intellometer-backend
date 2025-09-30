import { Router } from "express";
import { body } from "express-validator";
import passport from "passport";
import { signupHandler, googleCallbackHandler } from "../controllers/auth.controller";
//import { signup } from "../controllers/signup.controller";
import { verifyOtp } from "../controllers/verifyOtp.controller";
import { login } from "../controllers/login.controller";
import { refreshTokenHandler } from "../controllers/refreshToken.controller";
import { logout } from "../controllers/logout.controller";

const router = Router();

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
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", 
  passport.authenticate("google", { failureRedirect: "/auth/login" }),
  googleCallbackHandler
);

export default router;
