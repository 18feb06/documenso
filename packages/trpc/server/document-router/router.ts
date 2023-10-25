import { TRPCError } from '@trpc/server';

import { getServerLimits } from '@documenso/ee/server-only/limits/server';
import { createDocument } from '@documenso/lib/server-only/document/create-document';
import { deleteDraftDocument } from '@documenso/lib/server-only/document/delete-draft-document';
import { getDocumentById } from '@documenso/lib/server-only/document/get-document-by-id';
import { getDocumentAndSenderByToken } from '@documenso/lib/server-only/document/get-document-by-token';
import { sendDocument } from '@documenso/lib/server-only/document/send-document';
import { setFieldsForDocument } from '@documenso/lib/server-only/field/set-fields-for-document';
import { setRecipientsForDocument } from '@documenso/lib/server-only/recipient/set-recipients-for-document';

import { authenticatedProcedure, procedure, router } from '../trpc';
import {
  ZCreateDocumentMutationOutputSchema,
  ZCreateDocumentMutationSchema,
  ZDeleteDraftDocumentMutationOutputSchema,
  ZDeleteDraftDocumentMutationSchema,
  ZGetDocumentByIdQueryOutputSchema,
  ZGetDocumentByIdQuerySchema,
  ZGetDocumentByTokenQueryOutputSchema,
  ZGetDocumentByTokenQuerySchema,
  ZSendDocumentMutationOutputSchema,
  ZSendDocumentMutationSchema,
  ZSetFieldsForDocumentMutationOutputSchema,
  ZSetFieldsForDocumentMutationSchema,
  ZSetRecipientsForDocumentMutationOutputSchema,
  ZSetRecipientsForDocumentMutationSchema,
} from './schema';

export const documentRouter = router({
  getDocumentById: authenticatedProcedure
    .meta({
      summary: 'Get Document by [id]',
      description: 'Search or get Document by [id]. (Requires to be Authenticated).',
    })
    .input(ZGetDocumentByIdQuerySchema)
    .output(ZGetDocumentByIdQueryOutputSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { id } = input;

        return await getDocumentById({
          id,
          userId: ctx.user.id,
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'We were unable to find this document. Please try again later.',
        });
      }
    }),

  getDocumentByToken: procedure
    .meta({
      summary: 'Get Document by [token]',
      description: 'Search or get Document by [token].',
    })
    .input(ZGetDocumentByTokenQuerySchema)
    .output(ZGetDocumentByTokenQueryOutputSchema)
    .query(async ({ input }) => {
      try {
        const { token } = input;

        return await getDocumentAndSenderByToken({
          token,
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'We were unable to find this document. Please try again later.',
        });
      }
    }),

  createDocument: authenticatedProcedure
    .meta({
      summary: 'Create Document',
      description: 'Create a new Document. (Requires to be Authenticated).',
    })
    .input(ZCreateDocumentMutationSchema)
    .output(ZCreateDocumentMutationOutputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { title, documentDataId } = input;

        const { remaining } = await getServerLimits({ email: ctx.user.email });

        if (remaining.documents <= 0) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message:
              'You have reached your document limit for this month. Please upgrade your plan.',
          });
        }

        return await createDocument({
          userId: ctx.user.id,
          title,
          documentDataId,
        });
      } catch (err) {
        if (err instanceof TRPCError) {
          throw err;
        }

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'We were unable to create this document. Please try again later.',
        });
      }
    }),

  deleteDraftDocument: authenticatedProcedure
    .meta({
      summary: 'Delete Document',
      description:
        'Delete dcoument. Only possible if {document.status===DRAFT}. (Requires to be Authenticated).',
    })
    .input(ZDeleteDraftDocumentMutationSchema)
    .output(ZDeleteDraftDocumentMutationOutputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id } = input;

        const userId = ctx.user.id;

        return await deleteDraftDocument({ id, userId });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'We were unable to delete this document. Please try again later.',
        });
      }
    }),

  setRecipientsForDocument: authenticatedProcedure
    .meta({
      summary: 'Add Signers for Document',
      description: 'Add signers for Document. (Requires to be Authenticated).',
    })
    .input(ZSetRecipientsForDocumentMutationSchema)
    .output(ZSetRecipientsForDocumentMutationOutputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { documentId, recipients } = input;

        return await setRecipientsForDocument({
          userId: ctx.user.id,
          documentId,
          recipients,
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message:
            'We were unable to set the recipients for this document. Please try again later.',
        });
      }
    }),

  setFieldsForDocument: authenticatedProcedure
    .meta({
      summary: 'Add Fields for Document',
      description: 'Add Fields for Document. (Requires to be Authenticated).',
    })
    .input(ZSetFieldsForDocumentMutationSchema)
    .output(ZSetFieldsForDocumentMutationOutputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { documentId, fields } = input;

        return await setFieldsForDocument({
          userId: ctx.user.id,
          documentId,
          fields,
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'We were unable to set the fields for this document. Please try again later.',
        });
      }
    }),

  sendDocument: authenticatedProcedure
    .meta({
      summary: 'Send Document Signature Invitation',
      description:
        'Send invitation email to recipients for signing document. (Requires to be Authenticated).',
    })
    .input(ZSendDocumentMutationSchema)
    .output(ZSendDocumentMutationOutputSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { documentId } = input;

        return await sendDocument({
          userId: ctx.user.id,
          documentId,
        });
      } catch (err) {
        console.error(err);

        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'We were unable to send this document. Please try again later.',
        });
      }
    }),
});
