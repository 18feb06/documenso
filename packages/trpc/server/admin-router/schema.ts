import { IdentityProvider, Role } from '@prisma/client';
import z from 'zod';

export const ZUpdateProfileMutationByAdminSchema = z.object({
  id: z.number().min(1),
  name: z.string().nullish(),
  email: z.string().email().optional(),
  roles: z.array(z.nativeEnum(Role)).optional(),
});

export const ZUpdateProfileMutationByAdminOutputSchema = z.object({
  id: z.number(),
  name: z.string().nullable(),
  email: z.string(),
  emailVerified: z.date().nullable(),
  password: z.string().nullable(),
  source: z.string().nullable(),
  signature: z.string().nullable(),
  roles: z.array(z.nativeEnum(Role)),
  identityProvider: z.nativeEnum(IdentityProvider),
});

export type TUpdateProfileMutationByAdminSchema = z.infer<
  typeof ZUpdateProfileMutationByAdminSchema
>;

export type TUpdateProfileMutationByAdminOutputSchema = z.infer<
  typeof ZUpdateProfileMutationByAdminOutputSchema
>;
