'use client';

import ErrorBoundary from './ErrorBoundary';
import ProvidersRoot from './ProvidersRoot';

export default function ClientRoot({ children }) {
  return (
    <ErrorBoundary>
      <ProvidersRoot>
        {children}
      </ProvidersRoot>
    </ErrorBoundary>
  );
}
