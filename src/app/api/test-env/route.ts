import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  return new Response(JSON.stringify({
    hasApiKey: !!process.env.COZE_WORKLOAD_IDENTITY_API_KEY,
    hasBaseUrl: !!process.env.COZE_INTEGRATION_BASE_URL,
    hasModelBaseUrl: !!process.env.COZE_INTEGRATION_MODEL_BASE_URL,
    hasClientSecret: !!process.env.COZE_WORKLOAD_IDENTITY_CLIENT_SECRET,
    hasClientId: !!process.env.COZE_WORKLOAD_IDENTITY_CLIENT_ID,
    hasLoopToken: !!process.env.COZE_LOOP_API_TOKEN,
    nodeEnv: process.env.NODE_ENV,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
