import { Router } from 'express';
import { MessageController } from '../controllers/MessageController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const messageController = new MessageController();

router.use(authMiddleware);

router.post('/', messageController.create);
router.get('/room/:roomId', messageController.listByRoom);
router.get('/private', messageController.listPrivateMessages);
router.patch('/:messageId/read', messageController.markAsRead);

export default router; 