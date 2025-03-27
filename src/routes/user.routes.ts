import { Router } from 'express';
import { UserController } from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const userController = new UserController();

router.post('/register', userController.register);
router.post('/login', userController.login);

router.use(authMiddleware);
router.get('/me', userController.getMe);
router.post('/logout', userController.logout);

export default router; 