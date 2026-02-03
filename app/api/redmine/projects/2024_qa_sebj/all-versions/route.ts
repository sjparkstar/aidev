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
    
    // 먼저 메인 프로젝트와 서브프로젝트 목록을 가져온다
    console.log('🔍 Fetching main project and subprojects...');
    const projectsUrl = `${baseUrl}projects/2024_qa_sebj.json?include=subprojects`;
    
    const projectsResponse = await fetch(projectsUrl, {
      headers: {
        'X-Redmine-API-Key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!projectsResponse.ok) {
      const errorText = await projectsResponse.text();
      console.error('❌ Project fetch failed:', projectsResponse.status, errorText);
      throw new Error(`Failed to fetch projects: ${projectsResponse.status} - ${errorText}`);
    }

    const projectsData = await projectsResponse.json();
    console.log('📊 Projects data:', projectsData);
    
    if (!projectsData.project) {
      throw new Error('Main project not found');
    }
    
    const allProjects = [projectsData.project];
    if (projectsData.project?.children && Array.isArray(projectsData.project.children)) {
      allProjects.push(...projectsData.project.children);
    }
    
    console.log('📁 Total projects found:', allProjects.length);

    // 각 프로젝트의 버전들을 모두 가져온다
    const allVersions = [];
    const projectVersionsMap: { [projectId: number]: any[] } = {};

    for (const project of allProjects) {
      try {
        if (!project || !project.identifier) {
          console.warn('⚠️ Skipping invalid project:', project);
          continue;
        }
        
        const versionsUrl = `${baseUrl}projects/${project.identifier}/versions.json`;
        console.log('🔗 Fetching versions for project:', project.identifier);

        const versionsResponse = await fetch(versionsUrl, {
          headers: {
            'X-Redmine-API-Key': apiKey,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (versionsResponse.ok) {
          const versionsData = await versionsResponse.json();
          const versions = Array.isArray(versionsData.versions) ? versionsData.versions : [];
          
          console.log(`📅 Found ${versions.length} versions for project ${project.identifier}`);
          
          // 각 버전에 프로젝트 정보 추가
          const versionsWithProject = versions.map((version: any) => ({
            ...version,
            project: {
              id: project.id,
              identifier: project.identifier,
              name: project.name
            }
          }));

          allVersions.push(...versionsWithProject);
          projectVersionsMap[project.id] = versionsWithProject;
        } else {
          const errorText = await versionsResponse.text();
          console.warn(`⚠️ Failed to fetch versions for project ${project.identifier}:`, versionsResponse.status, errorText);
        }
      } catch (err) {
        console.error(`Error fetching versions for project ${project.identifier}:`, err);
      }
    }

    console.log('📊 Total versions found:', allVersions.length);

    return NextResponse.json({
      versions: allVersions,
      total_count: allVersions.length,
      projects: allProjects,
      project_versions: projectVersionsMap
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