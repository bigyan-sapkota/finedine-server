import { GetBookingsQuerySchema } from '@/dtos/bookings.dto';
import { BadRequestException } from '@/lib/exceptions';
import { Booking } from '@/models/bookings.model';
import { selectTableProperties, Table } from '@/models/tables.model';
import { selectUserProperties } from '@/models/users.model';

export const validateBookingTables = async (
  tables: { tableId: string; startsAt: string; hours: number }[]
) => {
  let promises: Promise<unknown>[] = [];
  let promise: Promise<unknown>;
  for (const table of tables) {
    const endsAt = new Date(new Date(table.startsAt).getTime() + table.hours * 60 * 60 * 1000);
    promise = Booking.find<{ table: { available: boolean } }>({
      table: table.tableId,
      $and: [{ startsAt: { $gte: table.startsAt } }, { endsAt: { $lt: endsAt } }]
    }).then((isBooked) => {
      if (isBooked) throw new BadRequestException('Some of the selected table is already booked');
    });
    promises.push(promise);
  }

  await Promise.all(promises);
  promises = [];

  for (const table of tables) {
    promise = Table.find({ _id: table.tableId, available: true }).then((result) => {
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
