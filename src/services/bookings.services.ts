import { GetBookingsQuerySchema } from '@/dtos/bookings.dto';
import { BadRequestException } from '@/lib/exceptions';
import { Booking, BookingSchema } from '@/models/bookings.model';
import { selectTableProperties, Table } from '@/models/tables.model';
import { selectUserProperties } from '@/models/users.model';
import { RootFilterQuery } from 'mongoose';

export const validateBookingTables = async (
  tables: { tableId: string; startsAt: string; endsAt: string }[]
) => {
  let promises: Promise<unknown>[] = [];
  let promise: Promise<unknown>;
  for (const table of tables) {
    promise = Booking.find<{ table: { available: boolean } }>({
      table: table.tableId,
      $and: [{ startsAt: { $gte: table.startsAt } }, { endsAt: { $lt: table.endsAt } }]
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
  const bookings = await Booking.find(
    JSON.parse(
      JSON.stringify({
        createdAt: cursor ? { $lt: cursor } : undefined,
        isCancelled: isCancelled,
        user: userId,
        table: tableId
      } satisfies RootFilterQuery<BookingSchema>)
    )
  )
    .populate('user', selectUserProperties)
    .populate('table', selectTableProperties)
    .limit(limit)
    .sort({ createdAt: 'desc' });

  return bookings;
};
