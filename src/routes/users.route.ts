import {
  getProfile,
  getUserDetails,
  queryUsers,
  updateProfile,
  updateUser
} from '@/controllers/users.controller';
import { Router } from 'express';

const router = Router();
export const usersRoute = router;

router.route('/profile').get(getProfile).put(updateProfile);
router.route('/').get(queryUsers);
router.route('/:id').get(getUserDetails).put(updateUser);
