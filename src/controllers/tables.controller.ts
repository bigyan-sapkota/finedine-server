import { createTableSchema, fetchTablesSchema, updateTableSchema } from '@/dtos/tables.dto';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@/lib/exceptions';
import { handleAsync } from '@/middlewares/handle-async';
import { Table } from '@/models/tables.model';

export const createTable = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  if (req.user.role !== 'admin') throw new ForbiddenException('Only admins can add the table');

  const data = createTableSchema.parse(req.body);
  const table = await Table.create(data);

  return res.json({ table, message: 'Table added successfully' });
});

export const updateTable = handleAsync<{ id: string }>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  if (req.user.role !== 'admin') throw new ForbiddenException('Only admins can update the table');

  // todo check bookings
  const tableId = req.params.id;
  const data = updateTableSchema.parse(req.body);
  const updatedTable = await Table.findByIdAndUpdate(tableId, data);
  if (!updatedTable) throw new NotFoundException('Table not found');

  return res.json({
    message: `Table - ${updatedTable.attribute} updated successfully`,
    table: updatedTable
  });
});

export const deleteTable = handleAsync<{ id: string }>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  if (req.user.role !== 'admin') throw new ForbiddenException('Only admins can update the table');

  // todo check bookings
  const tableId = req.params.id;
  const deletedTable = await Table.findByIdAndDelete(tableId);
  if (!deletedTable) throw new NotFoundException('Table not found');

  return res.json({ message: `Table - ${deletedTable.attribute} deleted successfully` });
});

export const fetchTables = handleAsync(async (req, res) => {
  const { tag } = fetchTablesSchema.parse(req.query);
  const tables = await Table.find(JSON.parse(JSON.stringify({ tag })));
  return res.json({ tables });
});

export const getTableDetails = handleAsync<{ id: string }>(async (req, res) => {
  const tableId = req.params.id;

  // todo populate bookings
  const table = await Table.findById(tableId);
  if (!table) throw new NotFoundException('Table not found');

  return res.json({ table });
});
