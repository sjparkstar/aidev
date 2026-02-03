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

    // Ensure URL ends with slash
    const baseUrl = redmineUrl.endsWith('/') ? redmineUrl : redmineUrl + '/';
    
    // 메인 프로젝트와 서브프로젝트 조회
    const mainProjectUrl = `${baseUrl}projects/2024_qa_sebj.json?include=subprojects`;

    console.log('🔗 Calling Redmine Project API:', mainProjectUrl);

    const response = await fetch(mainProjectUrl, {
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
          url: mainProjectUrl
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('📊 Project Response:', data.project?.name, 'with subprojects:', data.project?.children?.length || 0);

    if (!data.project) {
      return NextResponse.json(
        { error: 'Main project not found' },
        { status: 404 }
      );
    }

    // 메인 프로젝트와 서브프로젝트를 합친 배열 생성
    const allProjects = [data.project];
    if (data.project?.children && Array.isArray(data.project.children)) {
      allProjects.push(...data.project.children);
    }

    return NextResponse.json({
      projects: allProjects,
      total_count: allProjects.length,
      main_project: data.project
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