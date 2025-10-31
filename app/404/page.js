import Link from 'next/link'

export const metadata = {
  title: 'Page Not Found (404)',
  robots: { index: false, follow: false },
}

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page Not Found (404)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          The page you’re looking for doesn’t exist or may have moved. Try returning home or browsing our tools.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
          <Link href="/" className="btn btn-secondary">Explore Tools</Link>
        </div>
      </div>
    </div>
  )
}