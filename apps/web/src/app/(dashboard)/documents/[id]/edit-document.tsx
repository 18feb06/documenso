'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Field, Recipient, User } from '@documenso/prisma/client';
import { DocumentWithData } from '@documenso/prisma/types/document-with-data';
import { cn } from '@documenso/ui/lib/utils';
import { Card, CardContent } from '@documenso/ui/primitives/card';
import { AddFieldsFormPartial } from '@documenso/ui/primitives/document-flow/add-fields';
import { TAddFieldsFormSchema } from '@documenso/ui/primitives/document-flow/add-fields.types';
import { AddSignersFormPartial } from '@documenso/ui/primitives/document-flow/add-signers';
import { TAddSignersFormSchema } from '@documenso/ui/primitives/document-flow/add-signers.types';
import { AddSubjectFormPartial } from '@documenso/ui/primitives/document-flow/add-subject';
import { TAddSubjectFormSchema } from '@documenso/ui/primitives/document-flow/add-subject.types';
import {
  DocumentFlowFormContainer,
  DocumentFlowFormContainerHeader,
} from '@documenso/ui/primitives/document-flow/document-flow-root';
import { DocumentFlowStep } from '@documenso/ui/primitives/document-flow/types';
import { LazyPDFViewer } from '@documenso/ui/primitives/lazy-pdf-viewer';
import { useToast } from '@documenso/ui/primitives/use-toast';

import { getCreatorDetails } from '~/components/forms/edit-document/add-creator';
import { addFields } from '~/components/forms/edit-document/add-fields.action';
import { addSigners } from '~/components/forms/edit-document/add-signers.action';
import { completeDocument } from '~/components/forms/edit-document/add-subject.action';

export type EditDocumentFormProps = {
  className?: string;
  user: User;
  document: DocumentWithData;
  recipients: Recipient[];
  fields: Field[];
  dataUrl: string;
};

type CreatorDetails = {
  creatorEmail: string;
  creatorName: string;
};

type EditDocumentStep = 'signers' | 'fields' | 'subject';

export const EditDocumentForm = ({
  className,
  document,
  recipients,
  fields,
  user: _user,
  dataUrl,
}: EditDocumentFormProps) => {
  const { toast } = useToast();
  const router = useRouter();

  const [step, setStep] = useState<EditDocumentStep>('signers');
  const [creatorDetails, setCreatorDetails] = useState<CreatorDetails>({
    creatorEmail: '',
    creatorName: '',
  });
  const [selfSign, setSelfSign] = useState<boolean>(false);

  const documentFlow: Record<EditDocumentStep, DocumentFlowStep> = {
    signers: {
      title: 'Add Signers',
      description: 'Add the people who will sign the document.',
      stepIndex: 1,
    },
    fields: {
      title: 'Add Fields',
      description: 'Add all relevant fields for each recipient.',
      stepIndex: 2,
      onBackStep: () => setStep('signers'),
    },
    subject: {
      title: 'Add Subject',
      description: 'Add the subject and message you wish to send to signers.',
      stepIndex: 3,
      onBackStep: () => setStep('fields'),
    },
  };

  const currentDocumentFlow = documentFlow[step];

  const onAddSignersFormSubmit = async (data: TAddSignersFormSchema) => {
    try {
      const selfSigner = data.signers.filter(
        (signer) =>
          signer.email === creatorDetails.creatorEmail &&
          signer.name === creatorDetails.creatorName,
      );

      setSelfSign(selfSigner.length > 0);

      await addSigners({
        documentId: document.id,
        signers: data.signers,
      });

      router.refresh();
      setStep('fields');
    } catch (err) {
      console.error(err);

      toast({
        title: 'Error',
        description: 'An error occurred while adding signers.',
        variant: 'destructive',
      });
    }
  };

  const onAddFieldsFormSubmit = async (data: TAddFieldsFormSchema) => {
    try {
      await addFields({
        documentId: document.id,
        fields: data.fields,
      });

      if (selfSign && recipients.length === 1) {
        await completeDocument({
          documentId: document.id,
          email: { subject: '', message: '' },
        });
        router.push(`/sign/${recipients[0].token}`);
      } else {
        router.refresh();

        setStep('subject');
      }
    } catch (err) {
      console.error(err);

      toast({
        title: 'Error',
        description: 'An error occurred while adding fields.',
        variant: 'destructive',
      });
    }
  };

  const onAddSubjectFormSubmit = async (data: TAddSubjectFormSchema) => {
    const { subject, message } = data.email;

    try {
      const emailData = { subject, message };
      await completeDocument({
        documentId: document.id,
        email: emailData,
      });

      if (selfSign) {
        const selfSigner = recipients.find(
          (recipient) =>
            recipient.name === creatorDetails.creatorName &&
            recipient.email === creatorDetails.creatorEmail,
        );

        if (selfSigner) {
          router.push(`/sign/${selfSigner.token}`);
        }
      } else {
        router.push('/documents');
      }

      toast({
        title: 'Document sent',
        description: 'Your document has been sent successfully.',
        duration: 5000,
      });
    } catch (err) {
      console.error(err);

      toast({
        title: 'Error',
        description: 'An error occurred while sending the document.',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    const getDetails = async () => {
      try {
        const { email, name } = await getCreatorDetails();
        setCreatorDetails({ creatorEmail: email, creatorName: name });
      } catch (error) {
        // Handle errors if necessary
        console.error('Error fetching details:', error);
      }
    };
    void getDetails();
  }, []);

  return (
    <div className={cn('grid w-full grid-cols-12 gap-8', className)}>
      <Card
        className="relative col-span-12 rounded-xl before:rounded-xl lg:col-span-6 xl:col-span-7"
        gradient
      >
        <CardContent className="p-2">
          <LazyPDFViewer document={dataUrl} />
        </CardContent>
      </Card>

      <div className="col-span-12 lg:col-span-6 xl:col-span-5">
        <DocumentFlowFormContainer onSubmit={(e) => e.preventDefault()}>
          <DocumentFlowFormContainerHeader
            title={currentDocumentFlow.title}
            description={currentDocumentFlow.description}
          />

          {step === 'signers' && (
            <AddSignersFormPartial
              key={recipients.length}
              documentFlow={documentFlow.signers}
              recipients={recipients}
              fields={fields}
              numberOfSteps={Object.keys(documentFlow).length}
              onSubmit={onAddSignersFormSubmit}
              creatorEmail={creatorDetails.creatorEmail}
              creatorName={creatorDetails.creatorName}
            />
          )}

          {step === 'fields' && (
            <AddFieldsFormPartial
              key={fields.length}
              documentFlow={documentFlow.fields}
              recipients={recipients}
              fields={fields}
              numberOfSteps={Object.keys(documentFlow).length}
              onSubmit={onAddFieldsFormSubmit}
            />
          )}

          {step === 'subject' && (
            <AddSubjectFormPartial
              documentFlow={documentFlow.subject}
              document={document}
              recipients={recipients}
              fields={fields}
              numberOfSteps={Object.keys(documentFlow).length}
              onSubmit={onAddSubjectFormSubmit}
            />
          )}
        </DocumentFlowFormContainer>
      </div>
    </div>
  );
};
