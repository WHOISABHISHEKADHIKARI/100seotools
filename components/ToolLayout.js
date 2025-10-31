export default function ToolLayout({ tool, children }) {
  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">{tool.name}</h1>
            <p className="text-gray-600 dark:text-gray-400">{tool.description}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs px-2 py-1 rounded bg-gray-100 dark:bg-gray-800">{tool.category}</span>
            <a href={`/blog/${tool.slug}`} className="text-sm text-brand-600 hover:underline">Read guide</a>
          </div>
        </div>
      </div>
      <div className="card p-6">
        {children}
      </div>
    </div>
  );
}