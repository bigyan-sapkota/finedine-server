import { EnvType } from '@/config/env.config';
import { TUser } from './models/users.model';

export {};
declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvType {
      //
    }
  }
  namespace Express {
    interface Request {
      user: TUser;
    }
    interface User extends TUser {
      //
    }
  }
}
