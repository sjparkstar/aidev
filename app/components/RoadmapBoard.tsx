'use client';

import { useState, useEffect, useRef } from 'react';

interface Version {
  id: number;
  name: string;
  description?: string;
  status: string;
  due_date?: string;
  created_on: string;
  updated_on: string;
}

interface Issue {
  id: number;
  subject: string;
  status: {
    id: number;
    name: string;
  };
  priority: {
    id: number;
    name: string;
  };
  assigned_to?: {
    id: number;
    name: string;
  };
  created_on: string;
  updated_on: string;
}

interface RoadmapBoardProps {
  projectIdentifier?: string;
}

export default function RoadmapBoard({ projectIdentifier = '2024_qa_sebj' }: RoadmapBoardProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [versionIssues, setVersionIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 모바일 반응형 상태
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // 터치 제스처 관련
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // 버전 목록 가져오기
  useEffect(() => {
    const fetchVersions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/redmine/projects/${projectIdentifier}/roadmap`);
        if (!response.ok) {
          throw new Error('Failed to fetch versions');
        }
        const data = await response.json();
        setVersions(data.versions || []);
      } catch (err) {
        console.error('Error fetching versions:', err);
        setError('버전 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (projectIdentifier) {
      fetchVersions();
    }
  }, [projectIdentifier]);

  // 특정 버전의 이슈들 가져오기
  const fetchVersionIssues = async (version: Version) => {
    setIssuesLoading(true);
    setSelectedVersion(version);
    try {
      const response = await fetch(`/api/redmine/projects/${projectIdentifier}/versions/${version.id}/issues`);
      if (!response.ok) {
        throw new Error('Failed to fetch version issues');
      }
      const data = await response.json();
      setVersionIssues(data.issues || []);
    } catch (err) {
      console.error('Error fetching version issues:', err);
      setVersionIssues([]);
    } finally {
      setIssuesLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 왼쪽 남색 사이드바 */}
      <div className={`bg-slate-800 text-white transition-all duration-300 ${sidebarOpen ? 'w-80' : 'w-16'} flex flex-col`}>
        {/* 헤더 */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between">
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className="font-semibold">RemoteCall Redmine Manager</span>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            <button 
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white transition-colors mx-auto"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>

        {/* 메뉴 */}
        {sidebarOpen && (
          <nav className="flex-1 p-4 space-y-2">
            <div className="text-gray-300 text-sm mb-4">전체 서비스</div>
            
            {/* Redmine 7.* 관리 */}
            <div>
              <div className="text-white font-medium mb-2 flex items-center justify-between">
                <span>Redmine v7 관리</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4 space-y-1">
                <div className="text-gray-300 text-sm py-1 hover:text-white cursor-pointer">v7 Sprint</div>
                <div className="text-gray-300 text-sm py-1 hover:text-white cursor-pointer">전체 사용자</div>
                <div className="text-gray-300 text-sm py-1 hover:text-white cursor-pointer">회사 등록관리 신청</div>
                <div className="text-gray-300 text-sm py-1 hover:text-white cursor-pointer">미승인 요청관리</div>
              </div>
            </div>

            {/* 일반 로그인 관리 */}
            <div className="bg-blue-600 rounded px-3 py-2">
              <div className="text-white font-medium mb-2 flex items-center justify-between">
                <span>일반 로그인 관리</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-4 space-y-1">
                <div className="text-blue-100 text-sm py-1 hover:text-white cursor-pointer">일반 등록관리 내역</div>
                <div className="text-blue-100 text-sm py-1 hover:text-white cursor-pointer">일반 등록요청 내역</div>
                <div className="text-blue-100 text-sm py-1 hover:text-white cursor-pointer">미승인 요청관리</div>
                <div className="text-blue-100 text-sm py-1 hover:text-white cursor-pointer">삭제된 사용자 목록</div>
              </div>
            </div>

            {/* 네트워크 관리 */}
            <div>
              <div className="text-white font-medium mb-2 flex items-center justify-between">
                <span>네트워크 관리</span>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </nav>
        )}

        {/* 하단 언어 선택 */}
        {sidebarOpen && (
          <div className="p-4 border-t border-slate-700">
            <select className="bg-slate-700 text-white text-sm rounded px-2 py-1 w-full">
              <option value="ko">ko</option>
              <option value="en">en</option>
              <option value="ja">ja</option>
            </select>
          </div>
        )}
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col">
        {/* 상단 헤더 */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">일반 로그인 관리 생성법</h1>
              <p className="text-sm text-gray-600 mt-1">일반 사용자 &gt; 일반 사용자 &gt; 일반 로그인 생성법</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">사용자명</span>
              <span className="text-sm text-gray-600">내 정보보기</span>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 메인 바디 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* 상단 필터 영역 */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-700">버전 검색</label>
                  <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                    <option>전체버전 선택하세요</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
                  />
                  <button className="bg-blue-600 text-white px-4 py-1 rounded text-sm hover:bg-blue-700">
                    검색
                  </button>
                </div>
              </div>
            </div>

            {/* 버전 목록 테이블 */}
            <div className="overflow-x-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600 mt-2">로드맵 정보를 불러오는 중...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">상태</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">버전마케팅</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">버전번호</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">설명</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">등록일시</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">참고</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-blue-50 border-b border-gray-200">
                      <td className="px-4 py-2 text-sm">
                        <span className="text-gray-600">상태 종류(2002)</span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">NO</td>
                      <td className="px-4 py-2 text-sm text-gray-900">버전명 마케팅</td>
                      <td className="px-4 py-2 text-sm text-gray-900">상세내용</td>
                      <td className="px-4 py-2 text-sm text-gray-900">설명</td>
                      <td className="px-4 py-2 text-sm text-gray-900">등록일시</td>
                    </tr>
                    {versions.map((version, index) => (
                      <tr 
                        key={version.id} 
                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => fetchVersionIssues(version)}
                      >
                        <td className="px-4 py-3 text-sm">{index + 1}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{version.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{version.name}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {version.status === 'open' ? '진행중' : version.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(version.created_on).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          <a
                            href={`https://projects.rsupport.com/projects/${projectIdentifier}/roadmap`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={(e) => e.stopPropagation()}
                          >
                            보기 위로
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* 선택된 버전의 이슈 목록 */}
          {selectedVersion && (
            <div className="mt-6 bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <h3 className="text-lg font-medium text-gray-900">
                  {selectedVersion.name} - 등록된 일감 목록
                </h3>
              </div>
              <div className="overflow-x-auto">
                {issuesLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-center">
                      <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      <p className="text-gray-600 mt-2">일감을 불러오는 중...</p>
                    </div>
                  </div>
                ) : versionIssues.length === 0 ? (
                  <div className="flex items-center justify-center py-8">
                    <p className="text-gray-600">등록된 일감이 없습니다.</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">제목</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">상태</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">담당자</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">링크</th>
                      </tr>
                    </thead>
                    <tbody>
                      {versionIssues.map((issue) => (
                        <tr key={issue.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{issue.id}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{issue.subject}</td>
                          <td className="px-4 py-3 text-sm">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                              {issue.status.name}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {issue.assigned_to?.name || '-'}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <a
                              href={`https://projects.rsupport.com/issues/${issue.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 underline"
                            >
                              Redmine에서 보기
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}