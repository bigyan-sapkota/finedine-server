import { adminBookTablesSchema, getBookingsQuerySchema } from '@/dtos/bookings.dto';
import { z } from 'zod';
import { ZodOpenApiPathsObject } from 'zod-openapi';

const tags = ['Booking'];
export const bookingsDoc: ZodOpenApiPathsObject = {
  '/api/bookings': {
    post: {
      tags,
      summary: 'Book tables',
      requestBody: { content: { 'application/json': { schema: adminBookTablesSchema } } },
      responses: {
        201: { description: 'Table booked successfully' },
        400: { description: 'Invalid request body' },
        401: { description: 'User is not authorized' }
      }
    },
    get: {
      tags,
      summary: 'Fetching bookings list',
      requestParams: {
        query: getBookingsQuerySchema
      },
      responses: {
        200: { description: 'Bookings list fetched successfully' },
        400: { description: 'Invalid request query' },
        401: { description: 'User is not authorized' },
        403: { description: 'User is not admin or is trying to fetch the bookings of other users' }
      }
    }
  },
  '/api/bookings/{id}/cancel': {
    put: {
      tags,
      summary: 'Cancel booking',
      requestParams: {
        path: z.object({ id: z.string() })
      },
      responses: {
        200: { description: 'Booking cancelled successfully' },
        401: { description: 'User is not authorized' },
        403: { description: "User is not admin or trying to cancel the someone elses' booking" },
        404: { description: 'Booking not found' }
      }
    }
  }
};
