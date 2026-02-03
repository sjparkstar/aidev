import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ identifier: string; versionId: string }> }
) {
  try {
    const { identifier, versionId } = await params;
    
    // 환경변수에서 Redmine 설정 가져오기
    const redmineUrl = process.env.REDMINE_URL || process.env.NEXT_PUBLIC_REDMINE_URL || 'https://projects.rsupport.com';
    const apiKey = process.env.REDMINE_API_KEY || process.env.NEXT_PUBLIC_REDMINE_API_KEY || 'ecbaa70a2dcb4bf9e7d94a234be8db81c4953053';

    if (!redmineUrl || !apiKey) {
      console.error('❌ Missing environment variables:', { redmineUrl, apiKey });
      return NextResponse.json(
        { error: 'Missing Redmine configuration. Please check environment variables.' },
        { status: 500 }
      );
    }

    // Ensure URL ends with slash
    const baseUrl = redmineUrl.endsWith('/') ? redmineUrl : redmineUrl + '/';
    const url = `${baseUrl}projects/${identifier}/issues.json?fixed_version_id=${versionId}&limit=100`;

    console.log('🔗 Calling Redmine Version Issues API:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-Redmine-API-Key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Redmine API Error:', response.status, errorText);
      return NextResponse.json(
        { 
          error: `Redmine API Error: ${response.status}`,
          details: errorText,
          url: url
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('📊 Version Issues Response:', data.issues?.length || 0, 'issues');

    return NextResponse.json({
      issues: data.issues || [],
      total_count: data.total_count || 0,
      version_id: versionId
    });
  } catch (error) {
    console.error('❌ Unexpected Error:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal Server Error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}