import Link from 'next/link'

export const metadata = {
  title: 'Gone (410)',
  robots: { index: false, follow: false },
}

export default function GonePage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gone (410)</h1>
        <p className="mt-3 text-gray-600 dark:text-gray-300">
          This page has been permanently removed. If you followed an old link, please return home or search for the updated content.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <Link href="/" className="btn">Go Home</Link>
        </div>
      </div>
    </div>
  )
}