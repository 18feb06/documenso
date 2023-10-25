import { z } from 'zod';

export const ZSignFieldWithTokenMutationSchema = z.object({
  token: z.string(),
  fieldId: z.number(),
  value: z.string().trim(),
  isBase64: z.boolean().optional(),
});

export const ZSignFieldWithTokenMutationOutputSchema = z.void();

export type TSignFieldWithTokenMutationSchema = z.infer<typeof ZSignFieldWithTokenMutationSchema>;

export type TSignFieldWithTokenMutationOutputSchema = z.infer<
  typeof ZSignFieldWithTokenMutationOutputSchema
>;

export const ZRemovedSignedFieldWithTokenMutationSchema = z.object({
  token: z.string(),
  fieldId: z.number(),
});

export const ZRemovedSignedFieldWithTokenMutationOutputSchema = z.void();

export type TRemovedSignedFieldWithTokenMutationSchema = z.infer<
  typeof ZRemovedSignedFieldWithTokenMutationSchema
>;

export type TRemovedSignedFieldWithTokenMutationOutputSchema = z.infer<
  typeof ZRemovedSignedFieldWithTokenMutationOutputSchema
>;
