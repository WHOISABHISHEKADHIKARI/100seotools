"use client";

export default function OfflineContent() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="mb-8">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="64" 
          height="64" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          className="text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        >
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"></path>
          <path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"></path>
          <path d="M10.71 5.05A16 16 0 0 1 22.58 9"></path>
          <path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"></path>
          <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
          <line x1="12" y1="20" x2="12.01" y2="20"></line>
        </svg>
      </div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">You're offline</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        It looks like you're currently offline. Please check your internet connection and try again.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="btn"
        aria-label="Retry connection"
      >
        Try Again
      </button>
    </div>
  );
}