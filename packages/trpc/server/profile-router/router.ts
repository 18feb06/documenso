import { TRPCError } from '@trpc/server';

import { forgotPassword } from '@documenso/lib/server-only/user/forgot-password';
import { getUserById } from '@documenso/lib/server-only/user/get-user-by-id';
import { resetPassword } from '@documenso/lib/server-only/user/reset-password';
import { updatePassword } from '@documenso/lib/server-only/user/update-password';
import { updateProfile } from '@documenso/lib/server-only/user/update-profile';

import { adminProcedure, authenticatedProcedure, procedure, router } from '../trpc';
import {
  ZForgotPasswordFormOutputSchema,
  ZForgotPasswordFormSchema,
  ZResetPasswordFormOutputSchema,
  ZResetPasswordFormSchema,
  ZRetrieveUserByIdQueryOutputSchema,
  ZRetrieveUserByIdQuerySchema,
  ZUpdatePasswordMutationOutputSchema,
  ZUpdatePasswordMutationSchema,
  ZUpdateProfileMutationOutputSchema,
  ZUpdateProfileMutationSchema,
} from './schema';

export const profileRouter = router({
  getUser: adminProcedure
    .meta({
      summary: 'Retrieve User (as Admin)',
      description: 'Retrieve User by [id]. (Required to be Admin).',
    })
    .input(ZRetrieveUserByIdQuerySchema)
    .output(ZRetrieveUserByIdQueryOutputSchema)
    .query(async ({ input }) => {
      try {
        const { id } = input;

        return await getUserById({ id });
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'We were unable to retrieve the specified account. Please try again.',
        });
      }
    }),

  updateProfile: authenticatedProcedure
    .meta({
      summary: 'Update User Profile',
      description: 'Update User Profile. (Required to be Authenticated).',
    })
    .input(ZUpdateProfileMutationSchema)
    .output(ZUpdateProfileMutationOutputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { name, signature } = input;

        return await updateProfile({
          userId: ctx.user.id,
          name,
          signature,
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'We were unable to update your profile. Please review the information you provided and try again.',
        });
      }
    }),

  updatePassword: authenticatedProcedure
    .meta({
      summary: 'Update User Password',
      description: 'Update User Password. (Required to be Authenticated).',
    })
    .input(ZUpdatePasswordMutationSchema)
    .output(ZUpdatePasswordMutationOutputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { password, currentPassword } = input;

        return await updatePassword({
          userId: ctx.user.id,
          password,
          currentPassword,
        });
      } catch (err) {
        let message =
          'We were unable to update your profile. Please review the information you provided and try again.';

        if (err instanceof Error) {
          message = err.message;
        }

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message,
        });
      }
    }),

  forgotPassword: procedure
    .meta({
      summary: 'Get Password Reset Link',
      description: 'Forgot Password?? Get Password Reset Link.',
    })
    .input(ZForgotPasswordFormSchema)
    .output(ZForgotPasswordFormOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const { email } = input;

        return await forgotPassword({
          email,
        });
      } catch (err) {
        console.error(err);
      }
    }),

  resetPassword: procedure
    .meta({
      summary: 'Reset Password',
      description: 'Reset User Password.',
    })
    .input(ZResetPasswordFormSchema)
    .output(ZResetPasswordFormOutputSchema)
    .mutation(async ({ input }) => {
      try {
        const { password, token } = input;

        return await resetPassword({
          token,
          password,
        });
      } catch (err) {
        let message = 'We were unable to reset your password. Please try again.';

        if (err instanceof Error) {
          message = err.message;
        }

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message,
        });
      }
    }),
});
