import Link from 'next/link'

export const metadata = {
  title: 'Bad Gateway (502)',
  robots: { index: false, follow: false },
}

export default function BadGatewayPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bad Gateway (502)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          The server received an invalid response from an upstream server. Please try again later.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
        </div>
      </div>
    </div>
  )
}