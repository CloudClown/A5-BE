import { Router } from 'express';
import { walletController } from './wallet.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { validate } from '../../middlewares/validate.middleware';
import { walletTransactionSchema, sendMoneySchema } from '../../utils/validations';

const router = Router();

router.use(authenticate);

router.post('/deposit', validate(walletTransactionSchema), walletController.deposit);
router.post('/withdraw', validate(walletTransactionSchema), walletController.withdraw);
router.post('/send', validate(sendMoneySchema), walletController.send);

export const walletRoutes = router;