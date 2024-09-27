import { getNotifications } from '@/controllers/notifications.controller';
import { Router } from 'express';

const router = Router();
export const notificationsRoute = router;

router.route('/').get(getNotifications);
