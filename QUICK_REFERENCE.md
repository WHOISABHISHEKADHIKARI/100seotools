# 🚀 Quick Reference Guide - 100 SEO Tools

## Common Commands

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Analyze bundle size
npm run build:analyze
```

### Testing
```bash
# SEO tests
npm run test:seo

# Schema validation
npm run test:schema

# Accessibility tests
npm run test:accessibility

# Microdata tests
npm run test:microdata
```

### Linting & Validation
```bash
# Check external links
npm run lint:links

# Lint canonical URLs
npm run lint:canon

# Lint anchor tags
npm run lint:anchors

# Check whitespace
npm run lint:whitespace

# Fix whitespace
npm run fix:whitespace
```

---

## Component Usage

### Loading States
```javascript
import { LoadingSpinner, LoadingCard, LoadingGrid, LoadingPage } from '@/components/LoadingState';

// Spinner
<LoadingSpinner size="md" />

// Card skeleton
<LoadingCard />

// Grid of skeletons
<LoadingGrid count={6} />

// Full page loading
<LoadingPage />
```

### Empty States
```javascript
import { EmptyState, EmptySearchResults, EmptyCategory, ErrorState } from '@/components/EmptyState';

// Generic empty state
<EmptyState 
  icon={FiInbox}
  title="No items"
  description="..."
  action={<button>Action</button>}
/>

// Search results
<EmptySearchResults query={query} onClear={clearFn} />

// Category
<EmptyCategory categoryName="Keyword Research" />

// Error
<ErrorState message="Error message" onRetry={retryFn} />
```

### Error Boundary
```javascript
import ErrorBoundary from '@/components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

---

## File Structure

```
100SeoTools/
├── app/                    # Next.js App Router pages
│   ├── layout.js          # Root layout with metadata
│   ├── page.js            # Homepage
│   ├── globals.css        # Global styles
│   ├── category/          # Category pages
│   │   ├── layout.js      # Category metadata
│   │   ├── page.js        # Category index
│   │   └── [slug]/        # Dynamic category pages
│   ├── tools/             # Tool pages
│   ├── blog/              # Blog pages
│   ├── sitemap.js         # Sitemap generation
│   └── robots.js          # Robots.txt generation
├── components/            # Reusable components
│   ├── Navbar.js          # Navigation
│   ├── Footer.js          # Footer
│   ├── LoadingState.js    # Loading components
│   ├── EmptyState.js      # Empty state components
│   ├── ErrorBoundary.js   # Error handling
│   ├── ToolGrid.js        # Tool grid display
│   └── SearchFilter.js    # Search and filter
├── lib/                   # Utilities
│   ├── site.js            # Site config
│   ├── schema.js          # JSON-LD helpers
│   └── blog.js            # Blog utilities
├── tools/                 # Tool definitions
│   ├── index.js           # Tool registry
│   └── *.js               # Individual tools
├── public/                # Static assets
├── AUDIT_REPORT.md        # Full audit findings
├── FIXES_APPLIED.md       # Changelog
├── OPTIMIZATION_GUIDE.md  # Performance guide
└── FINAL_SUMMARY.md       # Complete summary
```

---

## Common Patterns

### Creating a New Tool Page
```javascript
// tools/my-new-tool.js
export default {
  slug: 'my-new-tool',
  name: 'My New Tool',
  description: 'Description of the tool',
  category: 'Keyword Research',
  icon: 'FiSearch',
  // ... other metadata
};

// Then import in tools/index.js
import myNewTool from './my-new-tool.js';
export const tools = [...existingTools, myNewTool];
```

### Adding Metadata to a Page
```javascript
// app/my-page/page.js
export async function generateMetadata() {
  return {
    title: 'Page Title',
    description: 'Page description',
    robots: { index: true, follow: true },
    alternates: { canonical: 'https://www.100seotools.com/my-page' },
    openGraph: {
      title: 'Page Title',
      description: 'Page description',
      url: 'https://www.100seotools.com/my-page',
      type: 'website'
    }
  };
}
```

### Adding Structured Data
```javascript
import StructuredData from '@/components/StructuredData';

const schema = {
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: 'Page Name',
  description: 'Page description',
  url: 'https://www.100seotools.com/page'
};

<StructuredData data={schema} />
```

---

## Troubleshooting

### Build Fails
```bash
# Check for errors
npm run build

# Common issues:
# 1. Event handlers in server components → Add 'use client'
# 2. Missing imports → Check import paths
# 3. Syntax errors → Check console output
```

### Hydration Errors
```javascript
// Problem: Server/client mismatch
// Solution: Use useEffect or 'use client'

'use client';
import { useState, useEffect } from 'react';

function Component() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return <div>Client-only content</div>;
}
```

### Metadata Not Working
```javascript
// Problem: Client component trying to export metadata
// Solution: Create layout.js

// app/my-route/layout.js
export async function generateMetadata() {
  return { title: 'My Title' };
}

export default function Layout({ children }) {
  return children;
}

// app/my-route/page.js
'use client';
export default function Page() {
  // Client component code
}
```

---

## Performance Tips

### 1. Use Dynamic Imports
```javascript
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

### 2. Optimize Images
```javascript
import Image from 'next/image';

<Image
  src="/image.jpg"
  alt="Description"
  width={800}
  height={600}
  priority={isAboveFold}
  quality={85}
/>
```

### 3. Lazy Load Below-the-Fold
```javascript
function AfterFirstPaint({ children }) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      window.requestIdleCallback(() => setMounted(true));
    } else {
      setTimeout(() => setMounted(true), 0);
    }
  }, []);
  
  if (!mounted) return null;
  return children;
}
```

---

## SEO Checklist

### Every Page Should Have:
- [ ] Unique title tag
- [ ] Meta description (150-160 chars)
- [ ] Canonical URL
- [ ] OpenGraph tags
- [ ] Twitter Card tags
- [ ] Structured data (JSON-LD)
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Alt text on images

### Sitemap
- [ ] All pages included
- [ ] Correct priorities (0.0-1.0)
- [ ] Change frequencies set
- [ ] Last modified dates

### Robots.txt
- [ ] Allow important pages
- [ ] Disallow admin/error pages
- [ ] Sitemap URL included

---

## Accessibility Checklist

### Interactive Elements
- [ ] Minimum 48x48px touch targets
- [ ] Visible focus indicators
- [ ] ARIA labels on icon buttons
- [ ] Keyboard navigation support

### Content
- [ ] Proper heading hierarchy
- [ ] Alt text on images
- [ ] Color contrast ≥ 4.5:1
- [ ] No text in images

### Forms
- [ ] Labels associated with inputs
- [ ] Error messages clear
- [ ] Required fields marked
- [ ] Validation feedback

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push origin feature/my-feature

# Create pull request on GitHub
```

### Commit Message Format
```
feat: add new feature
fix: resolve bug
docs: update documentation
style: format code
refactor: restructure code
test: add tests
chore: update dependencies
```

---

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production deployment
vercel --prod
```

### Manual Deployment
```bash
# Build
npm run build

# Start
npm start
```

---

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SITE_URL=https://www.100seotools.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_DISABLE_ANALYTICS=false
```

---

## Useful Links

- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Icons](https://react-icons.github.io/react-icons/)
- [Schema.org](https://schema.org/)
- [Google Search Console](https://search.google.com/search-console)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

## Support

### Documentation
- [AUDIT_REPORT.md](./AUDIT_REPORT.md) - Full audit
- [FIXES_APPLIED.md](./FIXES_APPLIED.md) - Changelog
- [OPTIMIZATION_GUIDE.md](./OPTIMIZATION_GUIDE.md) - Performance
- [FINAL_SUMMARY.md](./FINAL_SUMMARY.md) - Summary

### Contact
- Email: hashtagsolutionsocail@gmail.com
- Phone: +977-9823405140
- GitHub: https://github.com/hashtagsolutions

---

**Last Updated:** November 22, 2025
