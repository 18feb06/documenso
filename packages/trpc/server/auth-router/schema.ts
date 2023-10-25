import { IdentityProvider, Role } from '@prisma/client';
import { z } from 'zod';

export const ZSignUpMutationSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  signature: z.string().min(1, { message: 'A signature is required.' }),
});

export const ZSignUpMutationOutputSchema = z.object({
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

export type TSignUpMutationSchema = z.infer<typeof ZSignUpMutationSchema>;

export type TSignUpMutationOutputSchema = z.infer<typeof ZSignUpMutationOutputSchema>;
