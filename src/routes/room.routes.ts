import { Router } from 'express';
import { RoomController } from '../controllers/RoomController';
import { authMiddleware } from '../middlewares/auth';

const router = Router();
const roomController = new RoomController();

router.use(authMiddleware);

router.post('/', roomController.create);
router.get('/', roomController.list);
router.get('/:id', roomController.getById);
router.post('/:id/join', roomController.join);
router.post('/:id/leave', roomController.leave);

export default router; 