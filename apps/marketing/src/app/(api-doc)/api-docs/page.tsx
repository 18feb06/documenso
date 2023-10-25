'use client';

import ApiDocs from '~/components/api-docs/api-docs';
import ApiDocsHeader from '~/components/api-docs/header';

export default function ApiDocsPage() {
  return (
    <div>
      <ApiDocsHeader />
      <ApiDocs />
    </div>
  );
}
