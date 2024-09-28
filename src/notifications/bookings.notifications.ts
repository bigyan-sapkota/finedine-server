import { sendMail } from '@/lib/send-mail';
import { formatDate } from '@/lib/utils';
import { addNotification } from '@/services/notifications.services';

type BookingNotificationOptions = {
  user: {
    id: string;
    email: string;
    name: string;
  };
  booking: {
    startsAt: string;
  };
  type: 'booked' | 'cancelled';
};

export const sendBookingNotification = async ({
  user,
  type,
  booking
}: BookingNotificationOptions) => {
  let title = `Table booked successfully`;
  let description = `Your booking is scheduled at ${formatDate(booking.startsAt)}`;
  let mailMessage = `Hey ${user.name}, ${description}`;

  if (type === 'cancelled') {
    title = 'Table booking cancelled';
    description = `Your booking which was scheduled at ${formatDate(booking.startsAt)} is cancelled`;
    mailMessage = `Hey ${user.name}, ${description}`;
  }

  await Promise.all([
    addNotification({ description, title, user: user.id }),
    sendMail({ mail: user.email, text: mailMessage, subject: title })
  ]);
};
