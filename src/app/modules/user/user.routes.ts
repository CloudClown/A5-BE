import { Router } from 'express';
import { userController } from './user.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/me', userController.getProfile);
router.get('/transactions', userController.getMyTransactions);

export const userRoutes = router;