# API Helper Layer

The tool interface now uses `lib/outputHelper.js` as a predictable helper layer between API/tool results and the user interface.

OpenRouter access is isolated behind `lib/openRouterGateway.js` and the `/api/openrouter-report` route. The browser never calls OpenRouter directly.

## Output Contract

The helper accepts strings, arrays, or messy API objects and returns clean Markdown using this order:

1. Summary
2. Key Findings
3. Recommendations
4. Next Steps
5. Details

## Why It Exists

- Prevents raw JSON from appearing as the default user experience.
- Turns OpenRouter-style or tool API objects into simple sections regular users can scan.
- Keeps output formatting consistent across all tools.
- Gives future API routes a stable shape without rewriting UI components.

## Preferred API Response Shape

```json
{
  "success": true,
  "result": {
    "summary": "Short plain-English explanation.",
    "keyFindings": ["Important observation"],
    "recommendations": ["Useful action"],
    "nextSteps": ["What to do next"]
  }
}
```

Raw details are still preserved when useful, but they are presented after the readable sections.

## Dynamic Request Flow

1. User enters input in a tool.
2. `ToolRunner` sends the input to the server route for that tool.
3. The route can call `requestOpenRouterReport()` when `OPENROUTER_API_KEY` is configured.
4. The gateway sends a controlled prompt to OpenRouter and receives model output.
5. `formatToolOutput()` normalizes the response into report-style Markdown.
6. `OutputPresentation` renders the result as a visual report with summary, sections, metrics, and export actions.
