import { env } from '@/config/env.config';
import { User } from '@/models/users.model';
import { Strategy } from 'passport-google-oauth20';
export const GoogleStrategy = new Strategy(
  {
    clientID: env.GOOGLE_CLIENT_ID,
    clientSecret: env.GOOGLE_CLIENT_SECRET,
    callbackURL: env.GOOGLE_CALLBACK_URL,
    passReqToCallback: true
  },
  async function (req, accessToken, refreshToken, profile, done) {
    try {
      const name: string = profile.displayName;
      const email: string = profile.emails?.at(0)?.value || '';
      const image: string | null = profile.photos?.at(0)?.value || null;
      const userExists = await User.findOne({ email });
      if (userExists) return done(null, userExists);

      const newUser = await User.create({ name, email, image });
      return done(null, newUser);
    } catch (err) {
      done(err as Error, undefined);
    }
  }
);
