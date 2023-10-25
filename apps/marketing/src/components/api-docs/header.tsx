'use client';

import { cn } from '@documenso/ui/lib/utils';

import { Header } from '../(marketing)/header';

export default function ApiDocsHeader() {
  return (
    <div className={cn('w-full')}>
      <Header className="mx-auto h-16 max-w-screen-xl px-4 md:h-20 lg:px-8" />
    </div>
  );
}
