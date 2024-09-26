import { logout } from '@/controllers/auth.controller';
import { Router } from 'express';
import passport from 'passport';

const router = Router();
export const authRoute = router;

router.get('/login/google', passport.authenticate('google', { scope: ['email', 'profile'] }));
router.get('/callback/google', passport.authenticate('google'), (req, res) => {
  return res.redirect('/');
});
router.route('/logout').get(logout).post(logout);
