import { getNotificationsQuerySchema } from '@/dtos/notifications.dto';
import { ZodOpenApiPathsObject } from 'zod-openapi';

const tags = ['Notification'];
export const notificationsDoc: ZodOpenApiPathsObject = {
  '/api/notifications': {
    get: {
      tags,
      summary: 'Fetch notifications list',
      requestParams: { query: getNotificationsQuerySchema },
      responses: {
        200: { description: 'Notifications list fetched successfully' },
        400: { description: 'Invalid request query' }
      }
    }
  }
};
