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

  // bookings by admin
  if (req.user.role === 'admin') {
    const data = adminBookTablesSchema.parse(req.body);
    await validateBookingTables(data);
    await Booking.insertMany(
      data.map((item) => ({ ...item, user: item.userId, table: item.tableId }))
    );
    return res.json({
      message: `${data.length === 1 ? 'Booking' : 'Bookings'} created successfully`
    });
  }

  const data = bookTablesSchema.parse(req.body);
  await validateBookingTables(data);
  await Booking.insertMany(
    data.map((item) => ({ ...item, user: req.user?._id.toString(), table: item.tableId }))
  );

  sendBookingNotification({
    booking: { startsAt: data[0]?.startsAt! },
    type: 'booked',
    user: { email: req.user.email, id: req.user._id.toString(), name: req.user.name }
  });

  return res.json({
    message: `${data.length === 1 ? 'Booking' : 'Bookings'} created successfully`
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
  return res.json({ bookings: result });
});
