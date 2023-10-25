import { z } from 'zod';

export const ZCreateOrGetShareLinkMutationSchema = z.object({
  documentId: z.number(),
  token: z.string().optional(),
});

export const ZCreateOrGetShareLinkMutationOutputSchema = z.object({
  id: z.number(),
  email: z.string(),
  slug: z.string(),
  documentId: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TCreateOrGetShareLinkMutationSchema = z.infer<
  typeof ZCreateOrGetShareLinkMutationSchema
>;

export type TCreateOrGetShareLinkMutationOutputSchema = z.infer<
  typeof ZCreateOrGetShareLinkMutationOutputSchema
>;
