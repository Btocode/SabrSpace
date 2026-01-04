import { z } from 'zod';
import {
  questionSets,
  questions,
  responses,
  notifications,
  biodata,
  biodataReviews
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
        200: z.object({
          id: z.number(),
          userId: z.string(),
          questionerName: z.string(),
          curatorEmail: z.string().nullable(),
          answererCuratorEmail: z.string().nullable().optional(),
          token: z.string(),
          isOpen: z.boolean(),
          requireAttestation: z.boolean(),
          allowAnonymous: z.boolean(),
          allowMultipleSubmissions: z.boolean(),
          defaultLocale: z.string(),
          views: z.number(),
          createdAt: z.string(),
          updatedAt: z.string(),
          questions: z.array(z.object({
            id: z.number(),
            setId: z.number(),
            order: z.number(),
            type: z.enum(['TEXT', 'CHOICE']),
            prompt: z.string(),
            options: z.array(z.string()).nullable(),
            required: z.boolean(),
          })),
        }),
        404: errorSchemas.notFound,
      },
    },
    submitResponse: {
      method: 'POST' as const,
      path: '/api/public/sets/:token/submit',
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
      request: z.object({
        questionerName: z.string().min(1, "Questioner name is required"),
        curatorEmail: z.union([z.string().email(), z.literal("")]).optional(),
        isOpen: z.boolean().default(true),
        requireAttestation: z.boolean().default(false),
        allowAnonymous: z.boolean().default(false),
        allowMultipleSubmissions: z.boolean().default(false),
        defaultLocale: z.enum(['en', 'bn']).default('en'),
        questions: z.array(z.object({
          order: z.number(),
          type: z.enum(['TEXT', 'CHOICE']),
          prompt: z.string().min(1, "Question prompt is required"),
          options: z.array(z.string()).optional(),
          required: z.boolean().default(true),
        })),
      }),
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
    },
    addAnswererCurator: {
      method: 'POST' as const,
      path: '/api/public/sets/:token/add-curator',
      request: z.object({
        email: z.string().email("Please enter a valid email address"),
      }),
      responses: {
        200: z.object({ message: z.string() }),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
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
    getByTokenForCurator: {
      method: 'GET' as const,
      path: '/api/public/sets/:token/responses/curator',
      responses: {
        200: z.array(z.custom<any>()), // ResponseWithDetails
        403: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
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
  // Biodata
  biodata: {
    list: {
      method: 'GET' as const,
      path: '/api/biodata',
      responses: {
        200: z.array(z.custom<typeof biodata.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/biodata',
      responses: {
        201: z.custom<typeof biodata.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/biodata/:id',
      responses: {
        200: z.custom<typeof biodata.$inferSelect>(),
        404: errorSchemas.notFound,
        403: errorSchemas.unauthorized,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/biodata/:id',
      responses: {
        200: z.custom<typeof biodata.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        403: errorSchemas.unauthorized,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/biodata/:id',
      responses: {
        204: z.void(),
        403: errorSchemas.unauthorized,
      },
    },
    publish: {
      method: 'POST' as const,
      path: '/api/biodata/:id/publish',
      responses: {
        200: z.custom<typeof biodata.$inferSelect>(),
        400: errorSchemas.validation,
        403: errorSchemas.unauthorized,
      },
    },
    download: {
      method: 'GET' as const,
      path: '/api/biodata/:id/download',
      responses: {
        200: z.custom<any>(), // PDF buffer
        404: errorSchemas.notFound,
        403: errorSchemas.unauthorized,
      },
    },
  },
  biodataWizard: {
    createFromBasicProfile: {
      method: 'POST' as const,
      path: '/api/biodata/steps/basic_profile',
      responses: {
        201: z.custom<typeof biodata.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    updateStep: {
      method: 'PATCH' as const,
      path: '/api/biodata/:id/steps/:stepId',
      responses: {
        200: z.custom<typeof biodata.$inferSelect>(),
        400: errorSchemas.validation,
        404: errorSchemas.notFound,
        403: errorSchemas.unauthorized,
      },
    },
  },
  // Public Biodata
  publicBiodata: {
    get: {
      method: 'GET' as const,
      path: '/api/public/biodata/:token',
      responses: {
        200: z.custom<typeof biodata.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    download: {
      method: 'GET' as const,
      path: '/api/public/biodata/:token/download',
      responses: {
        200: z.custom<any>(), // PDF buffer
        404: errorSchemas.notFound,
      },
    },
  },
  // Biodata Admin (for reviews)
  biodataAdmin: {
    pending: {
      method: 'GET' as const,
      path: '/api/admin/biodata/pending',
      responses: {
        200: z.array(z.custom<typeof biodata.$inferSelect>()),
        403: errorSchemas.unauthorized,
      },
    },
    review: {
      method: 'POST' as const,
      path: '/api/admin/biodata/:id/review',
      responses: {
        200: z.custom<typeof biodata.$inferSelect>(),
        400: errorSchemas.validation,
        403: errorSchemas.unauthorized,
        404: errorSchemas.notFound,
      },
    },
  },
  dev: {
    seedSampleBiodata: {
      method: 'POST' as const,
      path: '/api/dev/seed-biodata',
      responses: {
        201: z.custom<typeof biodata.$inferSelect>(),
        401: errorSchemas.unauthorized,
        403: errorSchemas.unauthorized,
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
