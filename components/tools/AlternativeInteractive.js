"use client";

export default function AlternativeInteractive({ primaryUrl }) {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="content-input" className="block text-sm font-medium mb-2">
          Enter your content for analysis:
        </label>
        <textarea
          id="content-input"
          className="w-full h-32 p-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          placeholder="Paste your content here for keyword density analysis..."
        />
      </div>
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
        onClick={() => {
          alert('Analysis would be performed here in the full implementation');
        }}
      >
        Analyze Keywords
      </button>
    </div>
  );
}