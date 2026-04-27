'use client';

import { useState, useEffect } from 'react';
// Inline SVG icon components to avoid external dependencies
const IconBase = ({ className = 'w-5 h-5', children, strokeWidth = 2 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    {children}
  </svg>
);

const Search = ({ className }) => (
  <IconBase className={className}>
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </IconBase>
);

const Copy = ({ className }) => (
  <IconBase className={className}>
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <rect x="2" y="2" width="13" height="13" rx="2" />
  </IconBase>
);

const Check = ({ className }) => (
  <IconBase className={className}>
    <polyline points="20 6 9 17 4 12" />
  </IconBase>
);

const Palette = ({ className }) => (
  <IconBase className={className}>
    <path d="M12 22a10 10 0 1 1 0-20 5 5 0 0 1 0 10h-1a2 2 0 0 0 0 4h1" />
    <circle cx="6.5" cy="12" r="1.5" />
    <circle cx="8.5" cy="7" r="1.5" />
    <circle cx="14.5" cy="7" r="1.5" />
    <circle cx="16.5" cy="12" r="1.5" />
  </IconBase>
);

const Layout = ({ className }) => (
  <IconBase className={className}>
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="3" y1="9" x2="21" y2="9" />
    <line x1="9" y1="9" x2="9" y2="21" />
  </IconBase>
);

const MousePointer = ({ className }) => (
  <IconBase className={className}>
    <path d="M4 4l7 16 2-7 7-2-16-7z" />
  </IconBase>
);

const Smartphone = ({ className }) => (
  <IconBase className={className}>
    <rect x="7" y="2" width="10" height="20" rx="2" />
    <line x1="12" y1="18" x2="12" y2="18" />
  </IconBase>
);

const Zap = ({ className }) => (
  <IconBase className={className}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </IconBase>
);

const Eye = ({ className }) => (
  <IconBase className={className}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </IconBase>
);

const Moon = ({ className }) => (
  <IconBase className={className}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </IconBase>
);

const Sun = ({ className }) => (
  <IconBase className={className}>
    <circle cx="12" cy="12" r="4" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </IconBase>
);

const Code = ({ className }) => (
  <IconBase className={className}>
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </IconBase>
);

const BookOpen = ({ className }) => (
  <IconBase className={className}>
    <path d="M2 7a4 4 0 0 1 4-4h6v14H6a4 4 0 0 0-4 4V7z" />
    <path d="M22 7a4 4 0 0 0-4-4h-6v14h6a4 4 0 0 1 4 4V7z" />
  </IconBase>
);

// Navigation component
const GuidelinesNav = ({ activeSection, setActiveSection, sections }) => {
  return (
    <nav className="fixed left-6 top-1/2 transform -translate-y-1/2 z-50 hidden lg:block">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">Sections</h3>
        <ul className="space-y-2">
          {sections.map((section) => (
            <li key={section.id}>
              <button
                onClick={() => setActiveSection(section.id)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  activeSection === section.id
                    ? 'bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {section.icon}
                  <span>{section.title}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

// Code snippet component with copy functionality
const CodeSnippet = ({ code, language = 'jsx' }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="relative group">
      <pre className="bg-gray-900 dark:bg-gray-800 text-gray-100 dark:text-gray-200 p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 bg-gray-700 dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy code"
      >
        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-gray-300" />}
      </button>
    </div>
  );
};

// Example component showcase
const ComponentExample = ({ title, description, preview, code }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h4>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
      <div className="p-6 bg-gray-50 dark:bg-gray-900">
        <div className="mb-4">
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h5>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            {preview}
          </div>
        </div>
        <div>
          <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Code</h5>
          <CodeSnippet code={code} />
        </div>
      </div>
    </div>
  );
};

export function UIGuidelinesClient() {
  const [activeSection, setActiveSection] = useState('layout');
  const [searchTerm, setSearchTerm] = useState('');

  const sections = [
    { id: 'layout', title: 'Layout & Spacing', icon: <Layout className="w-4 h-4" /> },
    { id: 'components', title: 'Components', icon: <Palette className="w-4 h-4" /> },
    { id: 'interactive', title: 'Interactive Elements', icon: <MousePointer className="w-4 h-4" /> },
    { id: 'responsive', title: 'Responsive Design', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'animations', title: 'Animations', icon: <Zap className="w-4 h-4" /> },
    { id: 'accessibility', title: 'Accessibility', icon: <Eye className="w-4 h-4" /> },
    { id: 'themes', title: 'Dark/Light Mode', icon: <Moon className="w-4 h-4" /> },
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">UI Guidelines</h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-300">
                Comprehensive design system and component specifications
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search guidelines..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Navigation */}
        <GuidelinesNav
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          sections={filteredSections}
        />

        {/* Main Content */}
        <main className="flex-1 lg:ml-80">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

            {/* Layout & Spacing Section */}
            {activeSection === 'layout' && (
              <section id="layout" className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Layout & Spacing Standards</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Consistent layout and spacing creates visual hierarchy and improves user experience.
                  </p>
                </div>

                <div className="space-y-6">
                  <ComponentExample
                    title="Grid System"
                    description="12-column grid system with consistent gutters and margins"
                    preview={
                      <div className="grid grid-cols-12 gap-4">
                        <div className="col-span-12 bg-brand-100 dark:bg-brand-900 p-4 rounded text-center text-brand-700 dark:text-brand-300">Full Width (12 columns)</div>
                        <div className="col-span-6 bg-brand-100 dark:bg-brand-900 p-4 rounded text-center text-brand-700 dark:text-brand-300">Half (6 columns)</div>
                        <div className="col-span-6 bg-brand-100 dark:bg-brand-900 p-4 rounded text-center text-brand-700 dark:text-brand-300">Half (6 columns)</div>
                        <div className="col-span-4 bg-brand-100 dark:bg-brand-900 p-4 rounded text-center text-brand-700 dark:text-brand-300">Third (4 columns)</div>
                        <div className="col-span-4 bg-brand-100 dark:bg-brand-900 p-4 rounded text-center text-brand-700 dark:text-brand-300">Third (4 columns)</div>
                        <div className="col-span-4 bg-brand-100 dark:bg-brand-900 p-4 rounded text-center text-brand-700 dark:text-brand-300">Third (4 columns)</div>
                      </div>
                    }
                    code={`<div className="grid grid-cols-12 gap-4">
  <div className="col-span-12">Full Width</div>
  <div className="col-span-6">Half</div>
  <div className="col-span-6">Half</div>
  <div className="col-span-4">Third</div>
  <div className="col-span-4">Third</div>
  <div className="col-span-4">Third</div>
</div>`}
                  />

                  <ComponentExample
                    title="Spacing Scale"
                    description="Consistent spacing using Tailwind's spacing scale"
                    preview={
                      <div className="space-y-4">
                        <div className="bg-brand-100 dark:bg-brand-900 p-2 rounded text-brand-700 dark:text-brand-300">p-2 (0.5rem / 8px)</div>
                        <div className="bg-brand-100 dark:bg-brand-900 p-4 rounded text-brand-700 dark:text-brand-300">p-4 (1rem / 16px)</div>
                        <div className="bg-brand-100 dark:bg-brand-900 p-6 rounded text-brand-700 dark:text-brand-300">p-6 (1.5rem / 24px)</div>
                        <div className="bg-brand-100 dark:bg-brand-900 p-8 rounded text-brand-700 dark:text-brand-300">p-8 (2rem / 32px)</div>
                      </div>
                    }
                    code={`// Spacing utilities
<p className="p-2">Small padding (8px)</p>
<p className="p-4">Medium padding (16px)</p>
<p className="p-6">Large padding (24px)</p>
<p className="p-8">Extra large padding (32px)</p>

// Margin utilities
<div className="m-4">Margin all sides</div>
<div className="mt-4">Margin top</div>
<div className="mr-4">Margin right</div>
<div className="mb-4">Margin bottom</div>
<div className="ml-4">Margin left</div>`}
                  />
                </div>
              </section>
            )}

            {/* Components Section */}
            {activeSection === 'components' && (
              <section id="components" className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Component Design Systems</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Reusable components with consistent styling and behavior.
                  </p>
                </div>

                <div className="space-y-6">
                  <ComponentExample
                    title="Cards"
                    description="Card components with consistent padding, shadows, and corner radius"
                    preview={
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Basic Card</h4>
                          <p className="text-gray-600 dark:text-gray-300">Standard card with border and shadow</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-md hover:shadow-lg transition-shadow">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interactive Card</h4>
                          <p className="text-gray-600 dark:text-gray-300">Card with hover shadow effect</p>
                        </div>
                      </div>
                    }
                    code={`<!-- Basic Card -->
<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-sm">
  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Card Title</h4>
  <p className="text-gray-600 dark:text-gray-300">Card content</p>
</div>

<!-- Interactive Card -->
<div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 shadow-md hover:shadow-lg transition-shadow">
  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Card Title</h4>
  <p className="text-gray-600 dark:text-gray-300">Card content</p>
</div>`}
                  />

                  <ComponentExample
                    title="Buttons"
                    description="Primary, secondary, and tertiary button variants"
                    preview={
                      <div className="flex flex-wrap gap-4 items-center">
                        <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">Primary</button>
                        <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">Secondary</button>
                        <button className="px-4 py-2 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 font-medium transition-colors">Tertiary</button>
                        <button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">Large</button>
                        <button className="px-2 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded text-sm font-medium transition-colors">Small</button>
                        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium opacity-50 cursor-not-allowed" disabled>Disabled</button>
                      </div>
                    }
                    code={`<!-- Primary Button -->
<button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">
  Primary
</button>

<!-- Secondary Button -->
<button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-medium transition-colors">
  Secondary
</button>

<!-- Button Sizes -->
<button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">
  Large
</button>
<button className="px-2 py-1 bg-brand-600 hover:bg-brand-700 text-white rounded text-sm font-medium transition-colors">
  Small
</button>

<!-- Disabled Button -->
<button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium opacity-50 cursor-not-allowed" disabled>
  Disabled
</button>`}
                  />
                </div>
              </section>
            )}

            {/* Interactive Elements Section */}
            {activeSection === 'interactive' && (
              <section id="interactive" className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Interactive Elements</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Hover, focus, disabled, and loading states for interactive components.
                  </p>
                </div>

                <div className="space-y-6">
                  <ComponentExample
                    title="Hover States"
                    description="Visual feedback when users hover over interactive elements"
                    preview={
                      <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors duration-150">Hover Me</button>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition-colors duration-200 cursor-pointer">
                          <h5 className="font-medium text-gray-900 dark:text-white">Card Hover</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-300">Hover to see border change</p>
                        </div>
                        <a href="#" className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 underline transition-colors duration-200">Link Hover</a>
                      </div>
                    }
                    code={`<!-- Button Hover -->
<button className="bg-brand-600 hover:bg-brand-700 transition-colors duration-150">
  Hover Me
</button>

<!-- Card Hover -->
<div className="border border-gray-200 hover:border-brand-300 dark:hover:border-brand-600 transition-colors duration-200">
  Card content
</div>

<!-- Link Hover -->
<a className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 transition-colors duration-200">
  Link text
</a>`}
                  />

                  <ComponentExample
                    title="Focus States"
                    description="Keyboard navigation and focus indicators"
                    preview={
                      <div className="space-y-4">
                        <input
                          type="text"
                          placeholder="Focus this input"
                          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all"
                        />
                        <button className="px-4 py-2 bg-brand-600 text-white rounded-lg font-medium focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 outline-none transition-all">
                          Focus Button
                        </button>
                        <div className="flex space-x-4">
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all">
                            Option 1
                          </button>
                          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition-all">
                            Option 2
                          </button>
                        </div>
                      </div>
                    }
                    code={`<!-- Input Focus -->
<input
  className="focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
  placeholder="Focus this input"
/>

<!-- Button Focus -->
<button className="focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 outline-none">
  Focus Button
</button>

<!-- Focus with Offset -->
<button className="focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 outline-none">
  Button with focus offset
</button>`}
                  />
                </div>
              </section>
            )}

            {/* Responsive Design Section */}
            {activeSection === 'responsive' && (
              <section id="responsive" className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Responsive Design</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Mobile-first responsive design patterns and breakpoints.
                  </p>
                </div>

                <div className="space-y-6">
                  <ComponentExample
                    title="Breakpoints"
                    description="Standard breakpoints for responsive design"
                    preview={
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                          <div className="bg-brand-100 dark:bg-brand-900 p-4 rounded text-center text-brand-700 dark:text-brand-300">
                            <div className="font-medium">sm: 640px</div>
                            <div className="text-sm">Small devices</div>
                          </div>
                          <div className="bg-brand-100 dark:bg-brand-900 p-4 rounded text-center text-brand-700 dark:text-brand-300">
                            <div className="font-medium">md: 768px</div>
                            <div className="text-sm">Medium devices</div>
                          </div>
                          <div className="bg-brand-100 dark:bg-brand-900 p-4 rounded text-center text-brand-700 dark:text-brand-300">
                            <div className="font-medium">lg: 1024px</div>
                            <div className="text-sm">Large devices</div>
                          </div>
                          <div className="bg-brand-100 dark:bg-brand-900 p-4 rounded text-center text-brand-700 dark:text-brand-300">
                            <div className="font-medium">xl: 1280px</div>
                            <div className="text-sm">Extra large</div>
                          </div>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Responsive text sizing:</p>
                          <div className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-900 dark:text-white">
                            This text changes size at different breakpoints
                          </div>
                        </div>
                      </div>
                    }
                    code={`<!-- Responsive Grid -->
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- Columns stack on mobile, 2 columns on tablet, 4 on desktop -->
</div>

<!-- Responsive Typography -->
<div className="text-sm sm:text-base lg:text-lg xl:text-xl">
  Responsive text sizing
</div>

<!-- Responsive Spacing -->
<div className="p-4 sm:p-6 lg:p-8">
  Padding increases with screen size
</div>`}
                  />

                  <ComponentExample
                    title="Touch Targets"
                    description="Minimum touch target sizes for mobile devices"
                    preview={
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                          <button className="min-h-[44px] px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">
                            Minimum 44px height
                          </button>
                          <button className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors">
                            Comfortable 48px height
                          </button>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Touch-friendly links:</p>
                          <div className="space-y-2">
                            <a href="#" className="block p-3 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                              Large clickable area
                            </a>
                            <a href="#" className="block p-3 text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
                              Another large clickable area
                            </a>
                          </div>
                        </div>
                      </div>
                    }
                    code={`<!-- Minimum Touch Target -->
<button className="min-h-[44px] px-4 py-2">
  Minimum 44px height
</button>

<!-- Comfortable Touch Target -->
<button className="px-6 py-3">
  Comfortable 48px height
</button>

<!-- Large Clickable Areas -->
<a className="block p-3">
  Large clickable area
</a>`}
                  />
                </div>
              </section>
            )}

            {/* Animations Section */}
            {activeSection === 'animations' && (
              <section id="animations" className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Animation Principles</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Smooth, performant animations with proper timing and easing.
                  </p>
                </div>

                <div className="space-y-6">
                  <ComponentExample
                    title="Transition Timing"
                    description="Standard transition durations and timing functions"
                    preview={
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors duration-150">
                            Fast (150ms)
                          </button>
                          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors duration-200">
                            Normal (200ms)
                          </button>
                          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors duration-300">
                            Slow (300ms)
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-200 ease-in cursor-pointer">
                            <div className="font-medium text-gray-900 dark:text-white">ease-in</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Slow start</div>
                          </div>
                          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-200 ease-out cursor-pointer">
                            <div className="font-medium text-gray-900 dark:text-white">ease-out</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Slow end</div>
                          </div>
                          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:scale-105 transition-transform duration-200 ease-in-out cursor-pointer">
                            <div className="font-medium text-gray-900 dark:text-white">ease-in-out</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">Slow start & end</div>
                          </div>
                        </div>
                      </div>
                    }
                    code={`<!-- Transition Durations -->
<button className="transition-colors duration-150">Fast (150ms)</button>
<button className="transition-colors duration-200">Normal (200ms)</button>
<button className="transition-colors duration-300">Slow (300ms)</button>

<!-- Timing Functions -->
<div className="transition-transform duration-200 ease-in">ease-in</div>
<div className="transition-transform duration-200 ease-out">ease-out</div>
<div className="transition-transform duration-200 ease-in-out">ease-in-out</div>`}
                  />

                  <ComponentExample
                    title="GPU-Optimized Animations"
                    description="Use transform and opacity for smooth 60fps animations"
                    preview={
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-4">
                          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium hover:scale-105 transition-transform duration-200">
                            Scale Transform
                          </button>
                          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium hover:-translate-y-1 transition-transform duration-200">
                            Translate Up
                          </button>
                          <button className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium hover:rotate-3 transition-transform duration-200">
                            Rotate
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="w-16 h-16 bg-brand-600 rounded-lg opacity-75 hover:opacity-100 transition-opacity duration-200 cursor-pointer"></div>
                            <div className="mt-2 font-medium text-gray-900 dark:text-white">Opacity Transition</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">GPU optimized</div>
                          </div>
                          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="w-16 h-16 bg-brand-600 rounded-lg transform hover:scale-110 transition-transform duration-200 cursor-pointer"></div>
                            <div className="mt-2 font-medium text-gray-900 dark:text-white">Transform Scale</div>
                            <div className="text-sm text-gray-600 dark:text-gray-300">GPU optimized</div>
                          </div>
                        </div>
                      </div>
                    }
                    code={`<!-- GPU-Optimized Properties -->
/* Good for animations */
transform: scale(), translate(), rotate()
opacity

/* Avoid animating these */
width, height (triggers layout)
margin, padding (triggers layout)
top, left (triggers layout)

<!-- Examples -->
<button className="hover:scale-105 transition-transform duration-200">
  Scale Transform
</button>

<div className="opacity-75 hover:opacity-100 transition-opacity duration-200">
  Opacity Transition
</div>`}
                  />
                </div>
              </section>
            )}

            {/* Accessibility Section */}
            {activeSection === 'accessibility' && (
              <section id="accessibility" className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Accessibility Standards</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    WCAG 2.1 AA compliance and inclusive design principles.
                  </p>
                </div>

                <div className="space-y-6">
                  <ComponentExample
                    title="Color Contrast"
                    description="Meeting WCAG 2.1 AA contrast ratio requirements"
                    preview={
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-white rounded-lg border border-gray-200">
                            <div className="text-gray-900 bg-white p-3 rounded mb-2">
                              Normal Text: 4.5:1 contrast ratio
                            </div>
                            <div className="text-sm text-gray-600">This meets WCAG AA standards</div>
                          </div>
                          <div className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                            <div className="text-white bg-gray-900 p-3 rounded mb-2">
                              Normal Text: 4.5:1 contrast ratio
                            </div>
                            <div className="text-sm text-gray-400">This meets WCAG AA standards</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-brand-600 rounded-lg">
                            <div className="text-white bg-brand-600 p-3 rounded mb-2">
                              Large Text: 3:1 contrast ratio
                            </div>
                            <div className="text-sm text-brand-100">18pt+ or 14pt+ bold</div>
                          </div>
                          <div className="p-4 bg-accessibleGray-600 rounded-lg">
                            <div className="text-white bg-accessibleGray-600 p-3 rounded mb-2">
                              Accessible Gray Example
                            </div>
                            <div className="text-sm text-accessibleGray-200">Tested contrast ratio</div>
                          </div>
                        </div>
                      </div>
                    }
                    code={`<!-- WCAG Contrast Guidelines -->
/* Normal text: 4.5:1 contrast ratio */
.text-gray-900 { color: #111827; } /* 12.6:1 on white */

/* Large text: 3:1 contrast ratio */
.text-lg { font-size: 1.125rem; } /* 18px */

/* Test contrast ratios */
/* Use tools like WebAIM contrast checker */

<!-- Brand Colors with Good Contrast -->
.bg-brand-600 { /* Primary with white text */ }
.bg-accessibleGray-600 { /* Gray with white text */ }`}
                  />

                  <ComponentExample
                    title="ARIA Attributes"
                    description="Semantic markup and ARIA attributes for screen readers"
                    preview={
                      <div className="space-y-4">
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <nav role="navigation" aria-label="Main navigation">
                            <ul className="flex space-x-4">
                              <li><a href="#" className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">Home</a></li>
                              <li><a href="#" className="text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">About</a></li>
                              <li><a href="#" aria-current="page" className="text-brand-700 dark:text-brand-300 font-medium">Current Page</a></li>
                            </ul>
                          </nav>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <button
                            className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors"
                            aria-expanded="false"
                            aria-controls="menu-dropdown"
                          >
                            Menu
                          </button>
                          <div id="menu-dropdown" className="mt-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg" hidden>
                            <ul role="menu">
                              <li role="none"><a role="menuitem" href="#" className="block py-1 text-gray-700 dark:text-gray-300 hover:text-brand-600">Option 1</a></li>
                              <li role="none"><a role="menuitem" href="#" className="block py-1 text-gray-700 dark:text-gray-300 hover:text-brand-600">Option 2</a></li>
                            </ul>
                          </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <div role="alert" className="p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg">
                            <h4 className="font-medium text-green-800 dark:text-green-200">Success Message</h4>
                            <p className="text-sm text-green-700 dark:text-green-300">Your changes have been saved.</p>
                          </div>
                        </div>
                      </div>
                    }
                    code={`<!-- Navigation with ARIA -->
<nav role="navigation" aria-label="Main navigation">
  <ul>
    <li><a href="#" aria-current="page">Current Page</a></li>
  </ul>
</nav>

<!-- Button with ARIA -->
<button
  aria-expanded="false"
  aria-controls="menu-dropdown"
>
  Menu
</button>

<!-- Alert with ARIA -->
<div role="alert">
  <h4>Success Message</h4>
  <p>Your changes have been saved.</p>
</div>

<!-- Form Labels -->
<label for="email">Email Address</label>
<input id="email" type="email" aria-describedby="email-help" />
<div id="email-help">We'll never share your email.</div>`}
                  />
                </div>
              </section>
            )}

            {/* Dark/Light Mode Section */}
            {activeSection === 'themes' && (
              <section id="themes" className="space-y-8">
                <div>
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Dark/Light Mode</h2>
                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
                    Theme switching mechanics and color token mapping.
                  </p>
                </div>

                <div className="space-y-6">
                  <ComponentExample
                    title="Theme Toggle Button"
                    description="Standard theme toggle with icon and state management"
                    preview={
                      <div className="space-y-4">
                        <div className="flex items-center space-x-4">
                          <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                            <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                          </button>
                          <span className="text-gray-600 dark:text-gray-300">Light Mode</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors">
                            <Moon className="w-5 h-5 text-gray-300" />
                          </button>
                          <span className="text-gray-300">Dark Mode</span>
                        </div>
                        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">Auto Theme</span>
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 dark:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1"></span>
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                    code={`<!-- Theme Toggle Component -->
function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  return (
    <button
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
    >
      {theme === 'light' ? <Sun /> : <Moon />}
    </button>
  );
}

<!-- Theme Toggle with Text -->
<div className="flex items-center space-x-4">
  <button className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700">
    <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
  </button>
  <span className="text-gray-600 dark:text-gray-300">Light Mode</span>
</div>`}
                  />

                  <ComponentExample
                    title="Color Token Mapping"
                    description="Semantic color tokens that adapt to theme changes"
                    preview={
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-gray-900 dark:bg-white rounded"></div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">text-primary</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">gray-900 / white</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-gray-600 dark:bg-gray-400 rounded"></div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">text-secondary</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">gray-600 / gray-400</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-brand-600 rounded"></div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">text-brand</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">brand-600 (consistent)</div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div className="space-y-3">
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"></div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">bg-surface</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">white / gray-800</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-gray-50 dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700"></div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">bg-subtle</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">gray-50 / gray-900</div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-3">
                                <div className="w-6 h-6 bg-brand-50 dark:bg-brand-900 rounded"></div>
                                <div>
                                  <div className="font-medium text-gray-900 dark:text-white">bg-brand-subtle</div>
                                  <div className="text-sm text-gray-600 dark:text-gray-300">brand-50 / brand-900</div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Semantic Token Example</h4>
                          <div className="p-4 bg-surface dark:bg-gray-800 rounded-lg border border-border dark:border-gray-700">
                            <h5 className="text-primary dark:text-white font-medium">Component Title</h5>
                            <p className="text-secondary dark:text-gray-300">This text uses semantic tokens that automatically adapt to the current theme.</p>
                            <button className="mt-2 px-4 py-2 bg-brand text-white rounded-lg hover:bg-brand-700 transition-colors">
                              Themed Button
                            </button>
                          </div>
                        </div>
                      </div>
                    }
                    code={`<!-- Semantic Color Tokens -->
.text-primary { @apply text-gray-900 dark:text-white; }
.text-secondary { @apply text-gray-600 dark:text-gray-400; }
.text-brand { @apply text-brand-600; }

.bg-surface { @apply bg-white dark:bg-gray-800; }
.bg-subtle { @apply bg-gray-50 dark:bg-gray-900; }
.bg-brand { @apply bg-brand-600; }

.border-default { @apply border-gray-200 dark:border-gray-700; }

<!-- Usage -->
<div className="bg-surface text-primary border border-default">
  <h3 className="text-brand">Brand Title</h3>
  <p className="text-secondary">Secondary text</p>
</div>`}
                  />
                </div>
              </section>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}
