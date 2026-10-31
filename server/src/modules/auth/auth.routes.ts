import { Router } from 'express';
import {
  registerCustomer,
  login,
  refreshToken,
  logout,
  getMe,
  forgotPassword,
  resetPassword,
  createStaffMember,
  listStaffMembers,
} from './auth.controller';
import { authenticate, requireRoles } from '../../middleware/auth.middleware';

export const authRouter = Router();

// Public routes
authRouter.post('/register', registerCustomer);
authRouter.post('/login', login);
authRouter.post('/refresh', refreshToken);
authRouter.post('/logout', logout);
authRouter.post('/forgot-password', forgotPassword);
authRouter.post('/reset-password', resetPassword);

// Authenticated session route
authRouter.get('/me', authenticate, getMe);

// Admin-only Staff Management routes
authRouter.get('/staff', authenticate, requireRoles(['ADMIN']), listStaffMembers);
authRouter.post('/staff', authenticate, requireRoles(['ADMIN']), createStaffMember);

