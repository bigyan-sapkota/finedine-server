import 'colors';
import cookieSession from 'cookie-session';
import cors from 'cors';
import express from 'express';
import morgan from 'morgan';
import passport from 'passport';
import { absolutePath } from 'swagger-ui-dist';
import swaggerUi from 'swagger-ui-express';
import { env, validateEnv } from './config/env.config';
import { connectDatabase } from './lib/database';
import { NotFoundException } from './lib/exceptions';
import { devConsole, sessionOptions } from './lib/utils';
import { handleAsync } from './middlewares/handle-async';
import { handleErrorRequest } from './middlewares/handle-error-request';
import { regenerateSession } from './middlewares/regenerate-session';
import { openApiDoc } from './openapi';
import { GoogleStrategy } from './passport/google.strategy';
import { serializer } from './passport/serializer';
import { authRoute } from './routes/auth.route';
import { bookingsRoute } from './routes/bookings.route';
import { notificationsRoute } from './routes/notifications.route';
import { tablesRoute } from './routes/tables.route';
import { usersRoute } from './routes/users.route';
const app = express();
validateEnv();
connectDatabase();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (env.NODE_ENV === 'development') {
  app.use(morgan('common'));
}
app.use(cors({ origin: env.FRONTEND_URLS, credentials: true }));
app.enable('trust proxy');
app.use(cookieSession(sessionOptions));
app.use(regenerateSession);

app.use(passport.initialize());
app.use(passport.session());
passport.use('google', GoogleStrategy);
serializer();

app.get(
  '/',
  handleAsync(async (req, res) => {
    return res.json({
      message: 'Api is running fine...',
      env: env.NODE_ENV,
      date: new Date().toISOString()
    });
  })
);

/* --------- routes --------- */
app.use('/api/auth', authRoute);
app.use('/api/users', usersRoute);
app.use('/api/tables', tablesRoute);
app.use('/api/bookings', bookingsRoute);
app.use('/api/notifications', notificationsRoute);

if (env.NODE_ENV === 'production') {
  app.use('/docs', express.static(absolutePath()));
}
app.use(
  '/docs',
  swaggerUi.serve,
  swaggerUi.setup(openApiDoc, {
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.css',
    customJs: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.js',
    customSiteTitle: 'Finedine Api Documentation'
  })
);
app.use(() => {
  throw new NotFoundException();
});
app.use(handleErrorRequest);

if (env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    devConsole(`⚡[Server]: listening at http://localhost:${env.PORT}`.yellow);
  });
}
export default app;
