import { z } from 'zod';

import { IdentityProvider, Role } from '@documenso/prisma/client';

export const ZRetrieveUserByIdQuerySchema = z.object({
  id: z.number().min(1),
});

export const ZRetrieveUserByIdQueryOutputSchema = z.object({
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

export const ZUpdateProfileMutationSchema = z.object({
  name: z.string().min(1),
  signature: z.string(),
});

export const ZUpdateProfileMutationOutputSchema = z.object({
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

export const ZUpdatePasswordMutationSchema = z.object({
  currentPassword: z.string().min(6),
  password: z.string().min(6),
});

export const ZUpdatePasswordMutationOutputSchema = z.object({
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

export const ZForgotPasswordFormSchema = z.object({
  email: z.string().email().min(1),
});

export const ZForgotPasswordFormOutputSchema = z.void();

export const ZResetPasswordFormSchema = z.object({
  password: z.string().min(6),
  token: z.string().min(1),
});

export const ZResetPasswordFormOutputSchema = z.void();

export type TRetrieveUserByIdQuerySchema = z.infer<typeof ZRetrieveUserByIdQuerySchema>;
export type TRetrieveUserByIdQueryOutputSchema = z.infer<typeof ZRetrieveUserByIdQueryOutputSchema>;
export type TUpdateProfileMutationSchema = z.infer<typeof ZUpdateProfileMutationSchema>;
export type TUpdateProfileMutationOutputSchema = z.infer<typeof ZUpdateProfileMutationOutputSchema>;
export type TUpdatePasswordMutationSchema = z.infer<typeof ZUpdatePasswordMutationSchema>;
export type TUpdatePasswordMutationOutputSchema = z.infer<
  typeof ZUpdatePasswordMutationOutputSchema
>;
export type TForgotPasswordFormSchema = z.infer<typeof ZForgotPasswordFormSchema>;
export type TForgotPasswordFormOutputSchema = z.infer<typeof ZForgotPasswordFormOutputSchema>;
export type TResetPasswordFormSchema = z.infer<typeof ZResetPasswordFormSchema>;
export type TResetPasswordFormOutputSchema = z.infer<typeof ZResetPasswordFormOutputSchema>;
