import { env } from '@/config/env.config';
import { connect } from 'mongoose';
import { devConsole } from './utils';

export const connectDatabase = async () => {
  try {
    const { connection } = await connect(env.MONGO_URI);
    devConsole(`⚡[Server]: listening at http://localhost:${connection.host}`.magenta);
  } catch (error) {
    if (error instanceof Error) {
      devConsole(error.message);
    }
    devConsole(`Could not connect mongodb`.red);
  }
};
