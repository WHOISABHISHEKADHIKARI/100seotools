import { formatToolOutput } from './outputHelper.js';

const DEFAULT_MODEL = process.env.OPENROUTER_MODEL || 'openai/gpt-4o-mini';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

function safeStringify(value) {
  if (typeof value === 'string') return value;
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function buildToolPrompt({ toolName, toolSlug, inputs }) {
  return [
    'You are the professional helper layer for 100 SEO Tools.',
    'Turn user input into a clean, practical SEO report.',
    'Return concise Markdown with these exact sections:',
    '# Report',
    '## Executive Summary',
    '## Key Findings',
    '## Recommendations',
    '## Next Steps',
    'Avoid raw JSON, filler, hype, fake metrics, and robotic wording.',
    '',
    `Tool: ${toolName || toolSlug || 'SEO Tool'}`,
    `Inputs:\n${safeStringify(inputs)}`,
  ].join('\n');
}

export async function requestOpenRouterReport({ toolName, toolSlug, inputs, model = DEFAULT_MODEL }) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return {
      provider: 'local-fallback',
      result: formatToolOutput({
        summary: `Prepared a structured report for ${toolName || toolSlug || 'this tool'} using the provided input.`,
        keyFindings: ['OpenRouter is not configured on this server, so no external AI call was made.'],
        recommendations: ['Add OPENROUTER_API_KEY to enable dynamic AI reports.', 'Keep the same helper layer so output stays readable and predictable.'],
        nextSteps: ['Review the input, run the tool again after configuration, and export the finished report.'],
      }, { toolName, toolSlug }),
    };
  }

  const response = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://www.100seotools.com',
      'X-Title': '100 SEO Tools',
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      messages: [
        {
          role: 'system',
          content: 'You produce polished, useful SEO reports for regular users. Be specific, structured, and practical.',
        },
        {
          role: 'user',
          content: buildToolPrompt({ toolName, toolSlug, inputs }),
        },
      ],
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || 'OpenRouter request failed');
  }

  const content = data?.choices?.[0]?.message?.content || '';
  return {
    provider: 'openrouter',
    model,
    result: formatToolOutput(content, { toolName, toolSlug }),
    usage: data?.usage,
  };
}
