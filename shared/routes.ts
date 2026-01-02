import { z } from 'zod';
import { 
  createSetSchema, 
  updateSetSchema, 
  submitResponseSchema, 
  questionSets, 
  questions, 
  responses, 
  notifications 
} from './schema';

// === ERROR SCHEMAS ===
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// === API CONTRACT ===
export const api = {
  // Public
  public: {
    getSet: {
      method: 'GET' as const,
      path: '/api/public/sets/:token',
      responses: {
        200: z.custom<any>(), // QuestionSetWithQuestions
        404: errorSchemas.notFound,
      },
    },
    submitResponse: {
      method: 'POST' as const,
      path: '/api/public/sets/:token/submit',
      input: submitResponseSchema,
      responses: {
        201: z.custom<any>(), // Response
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
      },
    },
  },
  // Protected (Dashboard)
  sets: {
    list: {
      method: 'GET' as const,
      path: '/api/sets',
      responses: {
        200: z.array(z.custom<typeof questionSets.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/sets',
      input: createSetSchema,
      responses: {
        201: z.custom<any>(), // QuestionSetWithQuestions
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/sets/:id',
      responses: {
        200: z.custom<any>(), // QuestionSetWithQuestions
        404: errorSchemas.notFound,
        403: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/sets/:id',
      input: updateSetSchema,
      responses: {
        200: z.custom<any>(), // QuestionSetWithQuestions
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        403: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/sets/:id',
      responses: {
        204: z.void(),
        403: errorSchemas.unauthorized,
      },
    },
    regenerateToken: {
      method: 'POST' as const,
      path: '/api/sets/:id/token',
      responses: {
        200: z.object({ token: z.string() }),
        403: errorSchemas.unauthorized,
      },
    }
  },
  responses: {
    list: {
      method: 'GET' as const,
      path: '/api/sets/:setId/responses',
      responses: {
        200: z.array(z.custom<any>()), // ResponseWithDetails
        403: errorSchemas.unauthorized,
      },
    },
  },
  notifications: {
    list: {
      method: 'GET' as const,
      path: '/api/notifications',
      responses: {
        200: z.array(z.custom<typeof notifications.$inferSelect>()),
      },
    },
    markRead: {
      method: 'PATCH' as const,
      path: '/api/notifications/read',
      responses: {
        200: z.void(),
      },
    },
  },
  dashboard: {
    stats: {
      method: 'GET' as const,
      path: '/api/dashboard/stats',
      responses: {
        200: z.object({
          totalSets: z.number(),
          totalResponses: z.number(),
          totalViews: z.number(),
        }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
