const mobileFriendlyTest = {
  "slug": "mobile-friendly-test",
  "name": "Mobile-Friendly Test | Check Mobile Responsiveness",
  "category": "Technical SEO",
  "description": "Test how easily a visitor can use your page on a mobile device. Identify mobile usability issues and ensure your site is optimized for mobile-first indexing.",
  "metaTitle": "Mobile-Friendly Test | Free Website Responsiveness Tool",
  "metaDescription": "Is your website mobile-friendly? Use our free tool to test your page's responsiveness, identify usability issues, and ensure a great experience for mobile users.",
  "keywords": ["mobile-friendly test", "website responsiveness tool", "mobile usability checker", "mobile-first indexing", "technical seo"],
  "template": "mobileFriendlyTest",
  "api": true,
  "content": {
    "introduction": "Over 60% of global web traffic now comes from mobile devices, and Google uses mobile-first indexing to determine search rankings for the vast majority of queries. If your site fails to deliver a usable experience on a smartphone screen—tiny tap targets, unreadable text, horizontal scrolling, or content wider than the viewport—you're losing both visitors and rankings. Our Mobile-Friendly Test evaluates your page against Google's mobile usability criteria, pinpointing exactly where the experience breaks down and providing actionable fixes to ensure every visitor gets a seamless, thumb-friendly experience regardless of device size.",
    "whatItDoes": "The tool renders your page using a mobile viewport emulation, inspects the viewport meta configuration, measures tap target sizes and spacing, verifies font legibility without zooming, checks content width against the viewport, and flags elements that cause horizontal scrolling. It tests against Google's mobile-friendly criteria and reports pass/fail for each requirement, along with specific element selectors and CSS suggestions for remediation. The test also evaluates whether your page is ready for mobile-first indexing by confirming that critical content and structured data are accessible in the mobile rendering.",
    "whyItMatters": "Google switched to mobile-first indexing in 2019, meaning it predominantly uses the mobile version of your content for ranking and indexing. A page that looks perfect on desktop but breaks on mobile will rank lower even for desktop search results. Beyond SEO, poor mobile usability directly impacts conversions—studies show 53% of mobile users abandon sites that take over 3 seconds to load or present navigation difficulties. Common issues like tap targets smaller than 48x48 pixels, body text smaller than 16px, or content exceeding the viewport width create frustration that translates to lost revenue.",
    "benefits": [
      "Verify viewport meta tag is correctly configured to prevent unwanted zooming or scaling on mobile devices",
      "Identify tap targets that are too small or too closely spaced, causing accidental taps and user frustration",
      "Detect font sizes below 16px that force users to zoom in to read body text comfortably",
      "Flag content that exceeds the viewport width, causing horizontal scrolling that breaks the mobile experience",
      "Confirm that structured data, meta tags, and critical content are accessible in the mobile rendering for indexing",
      "Receive specific CSS and HTML fixes for each issue rather than generic recommendations"
    ],
    "useCases": [
      "Auditing a legacy website before a redesign to document all mobile usability issues that need addressing",
      "Validating a responsive redesign after deployment to confirm all previously identified issues are resolved",
      "Checking a specific landing page before launching a paid mobile advertising campaign to maximize conversion",
      "Ensuring a newly published blog post renders correctly on mobile devices before promoting it on social media",
      "Verifying that a single-page application with dynamic content loads correctly within mobile viewport constraints",
      "Preparing for Google's mobile-first indexing by confirming all critical on-page elements pass mobile checks"
    ],
    "bestPractices": [
      "Use CSS media queries and responsive frameworks rather than separate mobile sites to maintain a single codebase",
      "Set viewport meta tag to width=device-width, initial-scale=1.0 and avoid maximum-scale or user-scalable=no",
      "Ensure all tap targets are at least 48x48 pixels with at least 8 pixels of spacing between adjacent targets",
      "Use relative units (rem, em, percentages) for font sizes instead of fixed pixel values to respect user preferences",
      "Test on real devices in addition to emulation tools since touch behavior and rendering vary across hardware",
      "Implement lazy loading for below-fold images to improve both mobile page speed and initial viewport rendering"
    ],
    "exampleResults": "Sample Output:\n\nPage: https://example.com/landing-page\n\nViewport: ✅ width=device-width, initial-scale=1.0 detected\n\nTap Targets:\n- ❌ Button '.cta-primary' at (320, 480) is 36x36px. Minimum required: 48x48px.\n- ❌ Navigation link 'Pricing' at (280, 120) is 28x20px with 4px gap to adjacent link. Increase size and spacing.\n\nFont Legibility:\n- ⚠️ Body text '.product-description' uses font-size: 13px. Recommend minimum 16px for mobile readability.\n- ✅ Headlines use font-size: 24px and are legible without zooming.\n\nContent Width:\n- ❌ Element '.hero-image' causes horizontal overflow. Image width: 800px exceeds viewport: 375px. Add max-width: 100%.\n- ✅ Text content wraps within viewport boundaries.\n\nMobile-First Indexing:\n- ✅ Structured data (JSON-LD) found in mobile rendering.\n- ✅ Meta description and title tag present in mobile version.\n\nOverall: 3 issues found. Fix tap targets, reduce font size, and constrain hero image width.",
    "relatedTools": ["page-speed-score-simulator", "http-status-code-tester", "canonical-tag-checker"],
    "faqs": [
      {
        "q": "What's the difference between mobile-friendly and mobile-optimized?",
        "a": "Mobile-friendly means the page renders without errors on a mobile device. Mobile-optimized means the experience is specifically designed for mobile users with touch-friendly navigation, fast loading, and content prioritized for smaller screens. This tool checks mobile-friendliness; true optimization requires additional UX and performance work."
      },
      {
        "q": "Does mobile-first indexing mean I don't need a desktop site?",
        "a": "No. Mobile-first indexing means Google uses the mobile version of your content as the primary source for indexing and ranking. You still need a functional desktop experience, but the mobile version must contain all critical content, meta tags, and structured data that the desktop version has."
      },
      {
        "q": "How do I fix tap targets that are too small?",
        "a": "Increase the padding or size of the element using CSS. For links and buttons, ensure the clickable area is at least 48x48 pixels. You can use padding: 12px on a 24px-tall button to reach the minimum. For navigation links, add margin or padding between items to prevent accidental taps."
      },
      {
        "q": "Should I use a responsive design or a separate mobile site?",
        "a": "Responsive design is strongly recommended. It serves the same HTML with different CSS layouts, ensuring consistent content for mobile-first indexing. Separate mobile sites (m.domain.com) require managing two codebases, implementing rel=alternate/canonical tags, and risking content mismatches between versions."
      }
    ]
  }
};
export default mobileFriendlyTest;