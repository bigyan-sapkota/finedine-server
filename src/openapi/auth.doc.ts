import { ZodOpenApiPathsObject } from 'zod-openapi';

const tags = ['Auth'];
export const authDoc: ZodOpenApiPathsObject = {
  '/api/auth/logout': {
    post: {
      tags,
      summary: 'Logout',
      responses: {
        200: { description: 'Logged out successfully' },
        401: { description: 'User is not authorized' }
      }
    }
  }
};
