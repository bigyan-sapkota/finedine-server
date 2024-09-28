import {
  createTable,
  deleteTable,
  fetchAvailableTables,
  fetchTables,
  getTableDetails,
  updateTable
} from '@/controllers/tables.controller';
import { Router } from 'express';

const router = Router();
export const tablesRoute = router;

router.route('/').post(createTable).get(fetchTables);
router.get('/available', fetchAvailableTables);
router.route('/:id').put(updateTable).delete(deleteTable).get(getTableDetails);
