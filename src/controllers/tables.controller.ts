import { createTableSchema, fetchTablesSchema, updateTableSchema } from '@/dtos/tables.dto';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@/lib/exceptions';
import { handleAsync } from '@/middlewares/handle-async';
import { Booking } from '@/models/bookings.model';
import { Table } from '@/models/tables.model';

export const createTable = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  if (req.user.role !== 'admin') throw new ForbiddenException('Only admins can add the table');

  const data = createTableSchema.parse(req.body);
  const table = await Table.create(data);

  return res.status(201).json({ table, message: 'Table added successfully' });
});

export const updateTable = handleAsync<{ id: string }>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  if (req.user.role !== 'admin') throw new ForbiddenException('Only admins can update the table');

  const tableId = req.params.id;
  const { available, ...data } = updateTableSchema.parse(req.body);

  const isBooked = await Booking.find({
    table: tableId,
    isCancelled: false,
    startsAt: { $gt: new Date().toISOString() }
  }).limit(1);

  if (isBooked && Object.keys(data).length !== 0)
    throw new ForbiddenException("Can't update table while the bookings are pending");
  console.log(available, 'available');

  const updatedTable = await Table.findByIdAndUpdate(
    tableId,
    { ...data, available },
    { new: true }
  );
  if (!updatedTable) throw new NotFoundException('Table not found');

  return res.json({
    message: `Table - ${updatedTable.tag} ${updatedTable.attribute} updated successfully`,
    table: updatedTable
  });
});

export const deleteTable = handleAsync<{ id: string }>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  if (req.user.role !== 'admin') throw new ForbiddenException('Only admins can update the table');

  const tableId = req.params.id;
  const isBooked = await Booking.findOne({
    table: tableId,
    isCancelled: false,
    startsAt: { $gt: new Date().toISOString() }
  }).limit(1);

  if (isBooked) throw new ForbiddenException("Can't delete table while bookings are pending");

  const deletedTable = await Table.findByIdAndDelete(tableId);
  if (!deletedTable) throw new NotFoundException('Table not found');

  return res.json({
    message: `Table - ${deletedTable.tag} ${deletedTable.attribute} deleted successfully`
  });
});

export const fetchTables = handleAsync(async (req, res) => {
  const { tag } = fetchTablesSchema.parse(req.query);
  console.log({ tag });
  const tables = await Table.find({ tag: tag });
  return res.json({ tables });
});

export const getTableDetails = handleAsync<{ id: string }>(async (req, res) => {
  const tableId = req.params.id;

  const table = await Table.findById(tableId);
  if (!table) throw new NotFoundException('Table not found');

  return res.json({ table });
});
