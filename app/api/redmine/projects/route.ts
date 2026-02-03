import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // 환경변수에서 Redmine 설정 가져오기
    const redmineUrl = process.env.REDMINE_URL || process.env.NEXT_PUBLIC_REDMINE_URL || 'https://projects.rsupport.com';
    const apiKey = process.env.REDMINE_API_KEY || process.env.NEXT_PUBLIC_REDMINE_API_KEY;

    if (!redmineUrl || !apiKey) {
      console.error('❌ Missing environment variables:', { redmineUrl, apiKey: apiKey ? 'SET' : 'NOT_SET' });
      return NextResponse.json(
        { error: 'Missing Redmine configuration. Please check environment variables.' },
        { status: 500 }
      );
    }

    // URL 파라미터 처리
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') || '100';
    const offset = searchParams.get('offset') || '0';

    // Ensure URL ends with slash
    const baseUrl = redmineUrl.endsWith('/') ? redmineUrl : redmineUrl + '/';
    const url = `${baseUrl}projects.json?limit=${limit}&offset=${offset}&status=1`; // status=1은 활성 프로젝트만

    console.log('🔗 Calling Redmine Projects API:', url);

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
    console.log('📊 Projects Response:', data.projects?.length || 0, 'projects');

    return NextResponse.json({
      projects: data.projects || [],
      total_count: data.total_count || 0,
      limit: parseInt(limit),
      offset: parseInt(offset)
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