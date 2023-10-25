import { z } from 'zod';

import {
  DocumentDataType,
  DocumentStatus,
  FieldType,
  IdentityProvider,
  ReadStatus,
  Role,
  SendStatus,
  SigningStatus,
} from '@documenso/prisma/client';

export const ZGetDocumentByIdQuerySchema = z.object({
  id: z.number().min(1),
});

export const ZGetDocumentByIdQueryOutputSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  status: z.nativeEnum(DocumentStatus),
  documentDataId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  documentData: z.object({
    id: z.string(),
    type: z.nativeEnum(DocumentDataType),
    data: z.string(),
    initialData: z.string(),
  }),
  documentMeta: z
    .object({
      id: z.string(),
      subject: z.string().nullable(),
      message: z.string().nullable(),
      documentId: z.number(),
    })
    .nullable(),
});

export type TGetDocumentByIdQuerySchema = z.infer<typeof ZGetDocumentByIdQuerySchema>;

export type TGetDocumentByIdQueryOutputSchema = z.infer<typeof ZGetDocumentByIdQueryOutputSchema>;

export const ZGetDocumentByTokenQuerySchema = z.object({
  token: z.string().min(1),
});

export const ZGetDocumentByTokenQueryOutputSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  status: z.nativeEnum(DocumentStatus),
  documentDataId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  documentData: z.object({
    id: z.string(),
    type: z.nativeEnum(DocumentDataType),
    data: z.string(),
    initialData: z.string(),
  }),
  User: z.object({
    id: z.number(),
    name: z.string().nullable(),
    email: z.string(),
    emailVerified: z.date().nullable(),
    source: z.string().nullable(),
    signature: z.string().nullable(),
    roles: z.array(z.nativeEnum(Role)),
    identityProvider: z.nativeEnum(IdentityProvider),
  }),
});

export type TGetDocumentByTokenQuerySchema = z.infer<typeof ZGetDocumentByTokenQuerySchema>;

export type TGetDocumentByTokenQueryOutputSchema = z.infer<
  typeof ZGetDocumentByTokenQueryOutputSchema
>;

export const ZCreateDocumentMutationSchema = z.object({
  title: z.string().min(1),
  documentDataId: z.string().min(1),
});

export const ZCreateDocumentMutationOutputSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  status: z.nativeEnum(DocumentStatus),
  documentDataId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TCreateDocumentMutationSchema = z.infer<typeof ZCreateDocumentMutationSchema>;

export type TCreateDocumentMutationOutputSchema = z.infer<
  typeof ZCreateDocumentMutationOutputSchema
>;

export const ZSetRecipientsForDocumentMutationSchema = z.object({
  documentId: z.number(),
  recipients: z.array(
    z.object({
      id: z.number().nullish(),
      email: z.string().min(1).email(),
      name: z.string(),
    }),
  ),
});

export const ZSetRecipientsForDocumentMutationOutputSchema = z.array(
  z.object({
    id: z.number(),
    documentId: z.number(),
    email: z.string(),
    name: z.string(),
    token: z.string(),
    expired: z.date().nullable(),
    signedAt: z.date().nullable(),
    readStatus: z.nativeEnum(ReadStatus),
    signingStatus: z.nativeEnum(SigningStatus),
    sendStatus: z.nativeEnum(SendStatus),
  }),
);

export type TSetRecipientsForDocumentMutationSchema = z.infer<
  typeof ZSetRecipientsForDocumentMutationSchema
>;

export type TSetRecipientsForDocumentMutationOutputSchema = z.infer<
  typeof ZSetRecipientsForDocumentMutationOutputSchema
>;

export const ZSetFieldsForDocumentMutationSchema = z.object({
  documentId: z.number(),
  fields: z.array(
    z.object({
      id: z.number().nullish(),
      type: z.nativeEnum(FieldType),
      signerEmail: z.string().min(1),
      pageNumber: z.number().min(1),
      pageX: z.number().min(0),
      pageY: z.number().min(0),
      pageWidth: z.number().min(0),
      pageHeight: z.number().min(0),
    }),
  ),
});

export const ZSetFieldsForDocumentMutationOutputSchema = z.array(
  z.object({
    id: z.number(),
    documentId: z.number(),
    recipientId: z.number().nullable(),
    type: z.nativeEnum(FieldType),
    page: z.number(),
    positionX: z.union([z.number(), z.any()]),
    positionY: z.union([z.number(), z.any()]),
    width: z.union([z.number(), z.any()]),
    height: z.union([z.number(), z.any()]),
    customText: z.string(),
    inserted: z.boolean(),
  }),
);

export type TSetFieldsForDocumentMutationSchema = z.infer<
  typeof ZSetFieldsForDocumentMutationSchema
>;

export type TSetFieldsForDocumentMutationOutputSchema = z.infer<
  typeof ZSetFieldsForDocumentMutationOutputSchema
>;

export const ZSendDocumentMutationSchema = z.object({
  documentId: z.number(),
});

export const ZSendDocumentMutationOutputSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  status: z.nativeEnum(DocumentStatus),
  documentDataId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TSendDocumentMutationSchema = z.infer<typeof ZSendDocumentMutationSchema>;

export type TSendDocumentMutationOutputSchema = z.infer<typeof ZSendDocumentMutationOutputSchema>;

export const ZDeleteDraftDocumentMutationSchema = z.object({
  id: z.number().min(1),
});

export const ZDeleteDraftDocumentMutationOutputSchema = z.object({
  id: z.number(),
  userId: z.number(),
  title: z.string(),
  status: z.nativeEnum(DocumentStatus),
  documentDataId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type TDeleteDraftDocumentMutationSchema = z.infer<typeof ZDeleteDraftDocumentMutationSchema>;

export type TDeleteDraftDocumentMutationOutputSchema = z.infer<
  typeof ZDeleteDraftDocumentMutationOutputSchema
>;
