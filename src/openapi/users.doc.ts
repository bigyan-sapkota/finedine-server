import { queryUsersSchema, updateProfileSchema, updateUserSchema } from '@/dtos/users.dto';
import { z } from 'zod';
import { ZodOpenApiPathsObject } from 'zod-openapi';
import 'zod-openapi/extend';

const tags = ['User'];
export const usersDoc: ZodOpenApiPathsObject = {
  '/api/users/profile': {
    get: {
      tags,
      summary: 'Fetch user profile',
      responses: { 200: { description: 'User profile fetched successfully' } }
    },
    put: {
      tags,
      summary: 'Update profile',
      requestBody: {
        content: {
          'application/json': {
            schema: updateProfileSchema.openapi({
              example: { image: undefined, name: undefined, phone: undefined }
            })
          }
        }
      },
      responses: {
        200: { description: 'Profile updated successfully' },
        400: { description: 'Invalid request body' },
        401: { description: 'User is not authorized' }
      }
    }
  },
  '/api/users': {
    get: {
      tags,
      summary: 'Search users',
      requestParams: {
        query: queryUsersSchema
      },
      responses: {
        200: { description: 'Users list fetched successfully' },
        400: { description: 'Invalid request query' }
      }
    }
  },
  '/api/users/{id}': {
    get: {
      tags,
      summary: 'Get user details',
      requestParams: { path: z.object({ id: z.string() }) },
      responses: { 200: { description: 'User details fetched successfully' } }
    },
    put: {
      tags,
      summary: 'Update user',
      description: 'Authorized to admins only',
      requestParams: { path: z.object({ id: z.string() }) },
      requestBody: { content: { 'application/json': { schema: updateUserSchema } } },
      responses: {
        200: { description: 'User updated successfully' },
        400: { description: 'Invalid request body' },
        401: { description: 'User is not authorized' },
        403: { description: 'Only admins can update user' }
      }
    }
  }
};
