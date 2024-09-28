import {
  createTableSchema,
  fetchAvailableTablesSchema,
  fetchTablesSchema,
  updateTableSchema
} from '@/dtos/tables.dto';
import { z } from 'zod';
import { ZodOpenApiPathsObject } from 'zod-openapi';

const tags = ['Table'];
export const tablesDoc: ZodOpenApiPathsObject = {
  '/api/tables': {
    post: {
      tags,
      summary: 'Add a table',
      requestBody: {
        content: {
          'application/json': {
            schema: createTableSchema
          }
        }
      },
      responses: {
        201: { description: 'Table added successfully' },
        400: { description: 'Invalid requesty body' },
        401: { description: 'User is not authorized' },
        403: { description: 'Only admins can add table' }
      }
    },
    get: {
      tags,
      summary: 'Fetch tables list',
      requestParams: {
        query: fetchTablesSchema
      },
      responses: {
        200: { description: 'Tables list fetched successfully' },
        400: { description: 'Invaild request query' }
      }
    }
  },
  '/api/tables/available': {
    get: {
      tags,
      summary: 'Fetch available tables list',
      requestParams: { query: fetchAvailableTablesSchema },
      responses: { 200: { description: 'Tables list fetched successfully' } }
    }
  },
  '/api/tables/{id}': {
    put: {
      tags,
      summary: 'Update table',
      requestParams: { path: z.object({ id: z.string() }) },
      requestBody: { content: { 'application/json': { schema: updateTableSchema } } },
      responses: {
        200: { description: 'Table updated successfully' },
        400: { description: 'Invalid request body' },
        401: { description: 'User is not authorized' },
        403: { description: "User is not admin or table is already booked and can't be updated" }
      }
    },
    delete: {
      tags,
      summary: 'Delete table',
      requestParams: { path: z.object({ id: z.string() }) },
      responses: {
        200: { description: 'Table deleted successfully' },
        401: { description: 'User is not authorized' },
        403: { description: 'Only admins can delete the table' }
      }
    },
    get: {
      tags,
      summary: 'Get table details',
      requestParams: { path: z.object({ id: z.string() }) },
      responses: {
        200: { description: 'Table details fetched successfully' }
      }
    }
  }
};
