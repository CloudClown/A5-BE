import { Router } from 'express';
import { transactionController } from './transaction.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { transactionQuerySchema } from '../../utils/validations';

const router = Router();

router.use(authenticate);

router.get('/', validate(transactionQuerySchema), transactionController.getTransactionHistory);
router.get('/:id', transactionController.getTransactionDetails);

export const transactionRoutes = router;