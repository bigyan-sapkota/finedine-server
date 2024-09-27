import { Notification } from '@/models/notification.model';

type Options = {
  userId: string;
  title: string;
  description: string | undefined;
};
export const addNotification = async (...options: Options[]) => {
  await Notification.insertMany(options);
};
