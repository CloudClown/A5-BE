import { Router } from 'express';
import passport from 'passport';
import { authController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { loginSchema, registerSchema } from '../../utils/validations';
import { config } from '../../config/env';

const router = Router();

router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh-token', authController.refreshToken);

// Google OAuth routes
if (config.google.clientId && config.google.clientSecret) {
  router.get(
    '/google',
    passport.authenticate('google', {
      scope: ['profile', 'email'],
      session: false,
    })
  );

  router.get(
    '/google/callback',
    passport.authenticate('google', {
      session: false,
      failureRedirect: `${config.frontend.url}/login?error=google-auth-failed`,
    }),
    authController.googleCallback
  );
}

export const authRoutes = router;
