import { generateOpenAPIDocumentFromTRPCRouter } from 'openapi-trpc';

import { appRouter } from './router';

export const doc = generateOpenAPIDocumentFromTRPCRouter(appRouter, {
  pathPrefix: '/api/trpc',
});
