'use client';

import dynamic from 'next/dynamic';
import ErrorBoundary from './ErrorBoundary';

const ProvidersRootDynamic = dynamic(() => import('./ProvidersRoot'), { ssr: false });

export default function ClientRoot({ children }) {
  return (
    <ErrorBoundary>
      <ProvidersRootDynamic>
        {children}
      </ProvidersRootDynamic>
    </ErrorBoundary>
  );
}