import { queryUsersSchema, updateProfileSchema, updateUserSchema } from '@/dtos/users.dto';
import { ForbiddenException, NotFoundException, UnauthorizedException } from '@/lib/exceptions';
import { handleAsync } from '@/middlewares/handle-async';
import { User } from '@/models/users.model';
import { isValidObjectId } from 'mongoose';

export const getProfile = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  return res.json({ user: req.user });
});

export const updateProfile = handleAsync(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();

  const data = updateProfileSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(req.user.id, data);
  return res.json({ user, message: 'Profile updated successfully' });
});

export const queryUsers = handleAsync(async (req, res) => {
  const { limit, page, q, role } = queryUsersSchema.parse(req.query);

  const filters = JSON.parse(
    JSON.stringify({
      name: {
        $regex: q || '',
        $options: 'i'
      },
      email: {
        $regex: q || '',
        $options: 'i'
      },
      role
    })
  );

  const skip = (page - 1) * limit;
  const result = await User.find(filters).limit(limit).skip(skip);
  return res.json({ users: result });
});

export const getUserDetails = handleAsync<{ id: string }>(async (req, res) => {
  const userId = req.params.id;
  if (!isValidObjectId(userId)) throw new NotFoundException('User not found');

  const user = await User.findById(userId);
  if (!user) throw new NotFoundException('User not found');

  return res.json({ user });
});

export const updateUser = handleAsync<{ id: string }>(async (req, res) => {
  if (!req.user) throw new UnauthorizedException();
  if (req.user.role !== 'admin') throw new ForbiddenException('Only admins can update user');

  const { role } = updateUserSchema.parse(req.body);
  const user = await User.findByIdAndUpdate(req.params.id, { role });
  if (!user) throw new NotFoundException('User not found');

  return res.json({ message: 'User updated successfully', user });
});
