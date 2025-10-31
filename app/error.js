'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Something went wrong</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          An unexpected error occurred. You can try again or return to the homepage.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button className="btn" onClick={() => reset()}>Try Again</button>
          <Link href="/" className="btn">Go Home</Link>
        </div>
      </div>
    </div>
  )
}