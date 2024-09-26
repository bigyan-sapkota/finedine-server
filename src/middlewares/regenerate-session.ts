import { RequestHandler } from 'express';

export const regenerateSession: RequestHandler = (req, res, next) => {
  if (req.session && !req.session.regenerate) {
    // @ts-expect-error ...
    req.session.regenerate = (cb) => {
      cb();
    };
  }
  if (req.session && !req.session.save) {
    // @ts-expect-error ...
    req.session.save = (cb) => {
      cb();
    };
  }
  next();
};
