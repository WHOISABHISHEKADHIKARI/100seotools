# 100SEOTools Development Guide

This guide outlines the architecture, standard operating procedures, and content systems for the 100SEOTools project.

## 🏗️ Architecture

The project uses a **Serverless Factory** architecture to support 100+ tools efficiently on Vercel's free tier.

- **Frontend**: Next.js App Router (`app/`).
- **Tool Logic**: Serverless Node.js functions (`app/api/[tool-slug]/route.js`).
- **Configuration**: Metadata and text definitions in `tools/[tool-name].js`.
- **Content System**: Centralized guide generation in `lib/guides.js` and `components/ToolLayout.js`.

## 🛠️ Adding or Upgrading a Tool

To add a new tool or upgrade an existing one to API mode:

1.  **Define the Tool**: Create/Update `tools/[tool-slug].js`.
    *   Set `"api": true`.
    *   Define `template` (e.g., `simple`, `keywordSuggestions`) to map input fields.

2.  **Create the API Route**: Create `app/api/[tool-slug]/route.js`.
    *   Export a `POST` function.
    *   Accept JSON input (matching the template fields).
    *   Return `{ success: true, result: ... }`.

3.  **Content & Guide**:
    *   The `ToolLayout` component automatically generates the "Why Needed", "Role in SEO", and "FAQ" sections.
    *   To customize this content, update `lib/guides.js`. Add a conditional block for your tool slug to inject specific FAQs, "What It Does" text, or SEO requirements.

## 📝 Content System (`lib/guides.js`)

All tool pages automatically display:
1.  **Why This Tool Is Needed**: Defaults to a generic description or the `whatItDoes` override.
2.  **Role of This Tool in SEO**: Defaults to generic SEO benefits or the `whyItMattersSEO` override.
3.  **FAQs**: A list of questions and answers.

**To customize content for a tool:**
Open `lib/guides.js` and add a block like this:

```javascript
if (tool.slug === 'my-new-tool') {
  introduction = "Specific intro...";
  whatItDoes = "Specific explanation...";
  whyItMattersSEO = "Specific SEO value...";
  
  faqs.unshift(
    { q: "Specific Question?", a: "Specific Answer." }
  );
  
  // Add best practices, related tools, etc.
  bestPractices.push("Do X for better results");
}
```

## ✅ Quality Assurance (QA)

We have a comprehensive QA system in `scripts/qa-runner.js`.

**To run QA:**
```bash
node scripts/qa-runner.js
```
This script:
1.  Loads all tools.
2.  Generates valid, invalid, and edge-case inputs based on the tool's template.
3.  Tests the API endpoint.
4.  Generates `QA_FULL_REPORT.json`.

**To verify Page Content:**
```bash
node scripts/verify-tool-pages.js
```
This ensures all tool pages correctly render the required SEO and FAQ sections.
