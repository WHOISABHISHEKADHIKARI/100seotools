"use client";

import { UserPreferencesProvider } from '../contexts/UserPreferencesContext';

export default function ProvidersRoot({ children }) {
  // Defensive: ensure provider is a function before rendering
  const isValidProvider = typeof UserPreferencesProvider === 'function';

  if (!isValidProvider) {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.error('UserPreferencesProvider is not a function. Falling back to children.');
    }
    return children;
  }

  return (
    <UserPreferencesProvider>
      {children}
    </UserPreferencesProvider>
  );
}