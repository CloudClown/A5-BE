import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { updateUserRoleSchema, blockWalletSchema } from '../../utils/validations';
import { adminController } from './admin.controller';

const router = Router();

// Apply authentication and admin role authorization to all routes
router.use(authenticate, authorize('admin'));

// User management routes
router.get('/users', adminController.getAllUsers);
router.get('/agents', adminController.getAllAgents);
router.patch('/users/:id/role', validate(updateUserRoleSchema), adminController.updateUserRole);

// Wallet management routes
router.get('/wallets', adminController.getAllWallets);
router.patch('/wallets/:id/block', validate(blockWalletSchema), adminController.blockWallet);

// Transaction routes
router.get('/transactions', adminController.getAllTransactions);

export const adminRoutes = router;