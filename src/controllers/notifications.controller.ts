import { getNotificationsQuerySchema } from '@/dtos/notifications.dto';
import { UnauthorizedException } from '@/lib/exceptions';
import { handleAsync } from '@/middlewares/handle-async';
import { Notification } from '@/models/notification.model';

export const getNotifications = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();

  const { cursor, limit } = getNotificationsQuerySchema.parse(req.query);
  const result = await Notification.find({
    user: req.user._id.toString(),
    receivedAt: cursor ? { $lt: cursor } : undefined
  }).limit(limit);

  return res.json({ notifications: result });
});
