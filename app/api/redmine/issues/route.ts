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
    const limit = searchParams.get('limit') || '50';
    const offset = searchParams.get('offset') || '0';
    const projectId = searchParams.get('project_id');
    const fixedVersionId = searchParams.get('fixed_version_id');

    // Ensure URL ends with slash
    const baseUrl = redmineUrl.endsWith('/') ? redmineUrl : redmineUrl + '/';
    
    // URL 구성
    let url = `${baseUrl}issues.json?limit=${limit}&offset=${offset}`;
    
    // 추가 필터 파라미터
    if (projectId) {
      url += `&project_id=${projectId}`;
    }
    
    if (fixedVersionId) {
      url += `&fixed_version_id=${fixedVersionId}`;
    }

    // 상세 정보 포함 요청
    url += '&include=attachments,changesets,children,journals,relations,watchers';

    console.log('🔗 Calling Redmine Issues API:', url);

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
    console.log('📊 Issues Response:', data.issues?.length || 0, 'issues');

    return NextResponse.json({
      issues: data.issues || [],
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