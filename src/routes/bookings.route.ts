import { bookTables, cancelBooking, getBookings } from '@/controllers/bookings.controller';
import { Router } from 'express';

const router = Router();
export const bookingsRoute = router;

router.route('/').post(bookTables).get(getBookings);
router.route('/:id/cancel').put(cancelBooking);
