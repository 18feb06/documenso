import { TRPCError } from '@trpc/server';

import { updateUser } from '@documenso/lib/server-only/admin/update-user';

import { adminProcedure, router } from '../trpc';
import {
  ZUpdateProfileMutationByAdminOutputSchema,
  ZUpdateProfileMutationByAdminSchema,
} from './schema';

export const adminRouter = router({
  updateUser: adminProcedure
    .meta({
      summary: 'Update User (as Admin)',
      description: 'Update User. (Requires to be Admin).',
    })
    .input(ZUpdateProfileMutationByAdminSchema)
    .output(ZUpdateProfileMutationByAdminOutputSchema)
    .mutation(async ({ input }) => {
      const { id, name, email, roles } = input;

      try {
        return await updateUser({ id, name, email, roles });
      } catch (err) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'We were unable to retrieve the specified account. Please try again.',
        });
      }
    }),
});
