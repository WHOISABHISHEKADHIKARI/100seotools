"use client";

export default function KeywordDensityInteractive() {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="content-analysis" className="block text-sm font-medium mb-2">
          Enter your content for keyword analysis:
        </label>
        <textarea
          id="content-analysis"
          className="w-full h-40 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Paste your content here to analyze keyword density..."
        />
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
        onClick={() => {
          alert('Full keyword density analysis would be implemented here');
        }}
      >
        Analyze Keyword Density
      </button>
    </div>
  );
}