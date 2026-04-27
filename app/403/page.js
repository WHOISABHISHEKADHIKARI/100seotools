import Link from 'next/link'

export const metadata = {
  title: '403 Forbidden',
  robots: { index: false, follow: false },
}

export default function ForbiddenPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Access Forbidden (403)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          You don’t have permission to view this page. If you believe this is a mistake, please return home.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
        </div>
      </div>
    </div>
  )
}