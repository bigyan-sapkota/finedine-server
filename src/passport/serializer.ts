import { User } from '@/models/users.model';
import passport from 'passport';

export const serializer = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user || null);
    } catch (error) {
      return done(error, null);
    }
  });
};
