import { TRPCError } from '@trpc/server';

import { removeSignedFieldWithToken } from '@documenso/lib/server-only/field/remove-signed-field-with-token';
import { signFieldWithToken } from '@documenso/lib/server-only/field/sign-field-with-token';

import { procedure, router } from '../trpc';
import {
  ZRemovedSignedFieldWithTokenMutationOutputSchema,
  ZRemovedSignedFieldWithTokenMutationSchema,
  ZSignFieldWithTokenMutationOutputSchema,
  ZSignFieldWithTokenMutationSchema,
} from './schema';

export const fieldRouter = router({
  signFieldWithToken: procedure
    .meta({
      summary: 'Sign Signature Field with [token]',
      description: 'Sign a signature field of a Document with [token]',
    })
    .input(ZSignFieldWithTokenMutationSchema)
    .output(ZSignFieldWithTokenMutationOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const { token, fieldId, value, isBase64 } = input;

        return await signFieldWithToken({
          token,
          fieldId,
          value,
          isBase64,
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'We were unable to sign this field. Please try again later.',
        });
      }
    }),

  removeSignedFieldWithToken: procedure
    .meta({
      summary: 'Remove Signature Field with [token]',
      description:
        'Remove a signature field from a Document with [token]. Only possible if {recipient.signing===NOT_SIGNED}.',
    })
    .input(ZRemovedSignedFieldWithTokenMutationSchema)
    .output(ZRemovedSignedFieldWithTokenMutationOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const { token, fieldId } = input;

        return await removeSignedFieldWithToken({
          token,
          fieldId,
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'We were unable to remove the signature for this field. Please try again later.',
        });
      }
    }),
});
