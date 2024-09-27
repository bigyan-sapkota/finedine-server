import { getNotificationsQuerySchema } from '@/dtos/notifications.dto';
import { UnauthorizedException } from '@/lib/exceptions';
import { handleAsync } from '@/middlewares/handle-async';
import { Notification, NotificationSchema } from '@/models/notification.model';
import { RootFilterQuery } from 'mongoose';

export const getNotifications = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();

  const { cursor, limit } = getNotificationsQuerySchema.parse(req.query);
  const result = await Notification.find(
    JSON.parse(
      JSON.stringify({
        user: req.user._id.toString(),
        receivedAt: cursor ? { $lt: cursor } : undefined
      } satisfies RootFilterQuery<NotificationSchema>)
    )
  ).limit(limit);

  return res.json({ notifications: result });
});
