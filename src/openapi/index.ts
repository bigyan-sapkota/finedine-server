import { createDocument, ZodOpenApiPathsObject } from 'zod-openapi';
import { authDoc } from './auth.doc';
import { bookingsDoc } from './bookings.doc';
import { notificationsDoc } from './notifications.doc';
import { tablesDoc } from './tables.doc';
import { usersDoc } from './users.doc';

export const openApiDoc = createDocument({
  openapi: '3.0.0',
  info: {
    title: 'Finedine Server',
    version: '1.0.0',
    description: 'Api documentation for Finedine server'
  },
  paths: Object.assign(
    {
      '/': {
        get: {
          summary: 'Check server status',
          responses: { 200: { description: 'Server is running fine' } }
        }
      }
    } satisfies ZodOpenApiPathsObject,
    authDoc,
    usersDoc,
    tablesDoc,
    bookingsDoc,
    notificationsDoc
  ),
  components: {
    securitySchemes: {
      googleOAuth2: {
        type: 'oauth2',
        flows: {
          authorizationCode: {
            authorizationUrl: '/api/auth/login/google',
            tokenUrl: '/api/auth/callback/google',
            scopes: {
              openid: 'Grants access to user profile and email'
            }
          }
        }
      }
    }
  }
});
