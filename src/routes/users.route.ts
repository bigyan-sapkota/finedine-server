import {
  getProfile,
  getUserDetails,
  queryUsers,
  updateProfile
} from '@/controllers/users.controller';
import { Router } from 'express';

const router = Router();
export const usersRoute = router;

router.route('/profile').get(getProfile).put(updateProfile);
router.route('/').get(queryUsers);
router.get('/:id', getUserDetails);
