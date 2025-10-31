import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Page Not Found (404)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          We can’t find the page you’re looking for. It may have been moved or removed.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
          <Link href="/category/keyword-research" className="btn">Browse Tools</Link>
        </div>
      </div>
    </div>
  )
}