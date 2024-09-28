import { GetBookingsQuerySchema } from '@/dtos/bookings.dto';
import { BadRequestException } from '@/lib/exceptions';
import { Booking } from '@/models/bookings.model';
import { selectTableProperties, Table } from '@/models/tables.model';
import { selectUserProperties } from '@/models/users.model';

export const validateBookingTables = async ({
  tableIds,
  startsAt,
  endsAt
}: {
  tableIds: string[];
  startsAt: string;
  userId: string;
  endsAt: string;
}) => {
  let promises: Promise<unknown>[] = [];
  let promise: Promise<unknown>;
  for (const tableId of tableIds) {
    promise = Booking.findOne({
      table: tableId,
      $or: [
        { $and: [{ startsAt: { $lte: startsAt } }, { endsAt: { $gt: startsAt } }] },
        { $and: [{ startsAt: { $lt: endsAt } }, { endsAt: { $gt: endsAt } }] }
      ],
      isCancelled: false
    }).then((isBooked) => {
      if (isBooked) throw new BadRequestException('Some of the selected table is already booked');
    });
    promises.push(promise);
  }

  await Promise.all(promises);
  promises = [];

  for (const tableId of tableIds) {
    promise = Table.find({ _id: tableId, available: true }).then((result) => {
      if (!result) throw new BadRequestException('Table is not available for booking');
    });
    promises.push(promise);
  }
  await Promise.all(promises);
};

export const fetchBookings = async (query: GetBookingsQuerySchema) => {
  const { limit, cursor, isCancelled, userId, tableId } = query;
  const bookings = await Booking.find({
    createdAt: cursor ? { $lt: cursor } : undefined,
    isCancelled: isCancelled,
    user: userId,
    table: tableId
  })
    .populate('user', selectUserProperties)
    .populate('table', selectTableProperties)
    .limit(limit)
    .sort({ createdAt: 'desc' });

  return bookings;
};
