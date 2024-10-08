import {
  adminBookTablesSchema,
  bookTablesSchema,
  getBookingsQuerySchema
} from '@/dtos/bookings.dto';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@/lib/exceptions';
import { handleAsync } from '@/middlewares/handle-async';
import { Booking } from '@/models/bookings.model';
import { User } from '@/models/users.model';
import { sendBookingNotification } from '@/notifications/bookings.notifications';
import { fetchBookings, validateBookingTables } from '@/services/bookings.services';

export const bookTables = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();

  const { hours, startsAt, tableIds, userId } =
    req.user.role === 'admin'
      ? adminBookTablesSchema.parse(req.body)
      : bookTablesSchema.parse(req.body);

  const user = req.user.role === 'admin' ? await User.findById(userId) : req.user;
  if (!user) throw new NotFoundException('User does not exist');

  const endsAt = new Date(new Date(startsAt).getTime() + hours * 60 * 60 * 1000).toISOString();
  await validateBookingTables({
    startsAt,
    endsAt,
    tableIds,
    userId: user.id
  });
  await Booking.insertMany(
    tableIds.map((tableId) => {
      return {
        startsAt,
        endsAt,
        user,
        table: tableId
      };
    })
  );

  sendBookingNotification({
    booking: { startsAt },
    type: 'booked',
    user: { email: user.email, id: user._id.toString(), name: user.name }
  });

  return res.status(201).json({
    message: `${tableIds.length === 1 ? 'Booking' : 'Bookings'} created successfully`
  });
});

export const cancelBooking = handleAsync<{ id: string }>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();

  const bookingId = req.params.id;

  const booking = await Booking.findOne({ _id: bookingId, isCancelled: false });
  if (!booking) throw new NotFoundException('Booking not found');

  if (!(req.user.role === 'admin' || booking.user.toString() === req.user._id.toString())) {
    throw new ForbiddenException('Only admin or booking owner can cancel the booking');
  }

  const user = req.user.role === 'admin' ? await User.findById(booking.user.toString()) : req.user;

  booking.isCancelled = true;
  booking.save();

  sendBookingNotification({
    booking: { startsAt: new Date(booking.startsAt).toISOString() },
    type: 'cancelled',
    user: { email: user!.email, id: user!._id.toString(), name: user!.name }
  });

  return res.json({ message: 'Booking cancelled successfully' });
});

export const getBookings = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();

  const query = getBookingsQuerySchema.parse(req.query);
  if (query.userId && !(req.user._id.toString() === query.userId || req.user.role === 'admin'))
    throw new ForbiddenException('You are not authorized to access this resource');

  const result = await fetchBookings(query);
  return res.json({ totalResults: result.length, bookings: result });
});
