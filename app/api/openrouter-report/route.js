import { NextResponse } from 'next/server';
import { getToolBySlug } from '../../../tools';
import { requestOpenRouterReport } from '../../../lib/openRouterGateway.js';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const toolSlug = body?.toolSlug;
    const tool = toolSlug ? getToolBySlug(toolSlug) : null;

    const report = await requestOpenRouterReport({
      toolName: body?.toolName || tool?.name || 'SEO Report',
      toolSlug,
      inputs: body?.inputs || {},
      model: body?.model,
    });

    return NextResponse.json({
      success: true,
      result: report.result,
      provider: report.provider,
      model: report.model,
      usage: report.usage,
    });
  } catch (error) {
        console.error('openrouter-report error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Unable to generate report',
      },
      { status: 500 }
    );
  }
}
