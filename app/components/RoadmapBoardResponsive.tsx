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

export default function RoadmapBoardResponsive() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [versions, setVersions] = useState<Version[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null);
  const [versionIssues, setVersionIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuesLoading, setIssuesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 반응형 상태
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  // 터치 제스처 관련
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  
  // 메뉴 상태
  const [selectedMenu, setSelectedMenu] = useState<string>('login-management');
  
  // 화면 크기 감지
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      if (width < 768) {
        setSidebarOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // 터치 제스처 핸들러
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartX.current || !touchStartY.current) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX.current;
    const deltaY = touchEndY - touchStartY.current;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0 && touchStartX.current < 50) {
        setSidebarOpen(true);
      } else if (deltaX < 0 && sidebarOpen) {
        setSidebarOpen(false);
      }
    }
    
    touchStartX.current = 0;
    touchStartY.current = 0;
  };

  // RoadmapBoard 방식으로 버전 목록 가져오기
  useEffect(() => {
    const fetchVersions = async () => {
      if (selectedMenu !== 'login-management') return;
      
      setLoading(true);
      setError(null);
      const projectIdentifier = '2024_qa_sebj';
      
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

    fetchVersions();
  }, [selectedMenu]);

  // 특정 버전의 이슈들 가져오기 (RoadmapBoard 방식)
  const fetchVersionIssues = async (version: Version) => {
    const projectIdentifier = '2024_qa_sebj';
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
    <div className="flex h-screen bg-gray-100" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      {/* 모바일 오버레이 배경 */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* 왼쪽 남색 사이드바 */}
      <div className={`
        bg-slate-800 text-white transition-all duration-300 flex flex-col
        ${isMobile 
          ? `fixed left-0 top-0 h-full z-50 transform ${
              sidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full w-0'
            }`
          : `${sidebarOpen ? 'w-80' : 'w-16'}`
        }
      `}>
        {/* 헤더 */}
        <div className="p-4 border-b border-slate-700 flex items-center justify-between min-h-[60px]">
          {sidebarOpen ? (
            <>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">R</span>
                </div>
                <span className={`font-semibold ${isMobile ? 'text-sm' : ''}`}>RemoteCall Redmine Manager</span>
              </div>
              <button 
                onClick={() => setSidebarOpen(false)}
                className="text-gray-400 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </>
          ) : (
            <button 
              onClick={() => setSidebarOpen(true)}
              className="text-gray-400 hover:text-white transition-colors mx-auto min-w-[44px] min-h-[44px] flex items-center justify-center"
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
                <div className="text-gray-300 text-sm py-2 px-3 rounded cursor-pointer transition-colors min-h-[44px] flex items-center hover:text-white hover:bg-slate-600">v7 Sprint</div>
                <div className="text-gray-300 text-sm py-2 px-3 rounded cursor-pointer transition-colors min-h-[44px] flex items-center hover:text-white hover:bg-slate-600">전체 사용자</div>
                <div className="text-gray-300 text-sm py-2 px-3 rounded cursor-pointer transition-colors min-h-[44px] flex items-center hover:text-white hover:bg-slate-600">회사 등록관리 신청</div>
                <div className="text-gray-300 text-sm py-2 px-3 rounded cursor-pointer transition-colors min-h-[44px] flex items-center hover:text-white hover:bg-slate-600">미승인 요청관리</div>
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
                <div className="text-blue-100 text-sm py-2 px-3 rounded cursor-pointer transition-colors min-h-[44px] flex items-center hover:text-white hover:bg-blue-700">일반 등록관리 내역</div>
                <div className="text-blue-100 text-sm py-2 px-3 rounded cursor-pointer transition-colors min-h-[44px] flex items-center hover:text-white hover:bg-blue-700">일반 등록요청 내역</div>
                <div className="text-blue-100 text-sm py-2 px-3 rounded cursor-pointer transition-colors min-h-[44px] flex items-center hover:text-white hover:bg-blue-700">미승인 요청관리</div>
                <div className="text-blue-100 text-sm py-2 px-3 rounded cursor-pointer transition-colors min-h-[44px] flex items-center hover:text-white hover:bg-blue-700">삭제된 사용자 목록</div>
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
        <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {/* 모바일 메뉴 버튼 */}
              {isMobile && (
                <button 
                  onClick={() => setSidebarOpen(true)}
                  className="text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}
              <div>
                <h1 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold text-gray-900`}>일반 로그인 관리 생성법</h1>
                {!isMobile && (
                  <p className="text-sm text-gray-600 mt-1">일반 사용자 &gt; 일반 사용자 &gt; 일반 로그인 생성법</p>
                )}
              </div>
            </div>
            <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
              {!isMobile && (
                <>
                  <span className="text-sm text-gray-600">사용자명</span>
                  <span className="text-sm text-gray-600">내 정보보기</span>
                </>
              )}
              <button className="text-gray-400 hover:text-gray-600 min-w-[44px] min-h-[44px] flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 메인 바디 */}
        <div className="flex-1 p-4 md:p-6 overflow-y-auto">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* 상단 필터 영역 */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              {/* 모바일 필터 토글 */}
              {isMobile && (
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-700">검색 및 필터</h3>
                  <button
                    onClick={() => setFiltersOpen(!filtersOpen)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium min-h-[44px] flex items-center"
                  >
                    {filtersOpen ? '닫기' : '열기'}
                    <svg 
                      className={`w-4 h-4 ml-1 transition-transform ${filtersOpen ? 'rotate-180' : ''}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}

              {/* 필터 콘텐츠 */}
              <div className={`${
                isMobile 
                  ? `overflow-hidden transition-all duration-300 ${
                      filtersOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                    }`
                  : ''
              } space-y-4`}>
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <label className="text-sm text-gray-700 font-medium">버전 검색</label>
                    <select className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:min-w-[200px] min-h-[44px]">
                      <option>전체버전 선택하세요</option>
                    </select>
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
                    <label className="text-sm text-gray-700 font-medium md:hidden">검색</label>
                    <input
                      type="text"
                      placeholder="검색어를 입력하세요"
                      className="border border-gray-300 rounded px-3 py-2 text-sm w-full md:w-64 min-h-[44px]"
                    />
                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 min-h-[44px]">
                      검색
                    </button>
                  </div>
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
                      <th className={`px-4 py-3 text-left font-medium text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>상태</th>
                      <th className={`px-4 py-3 text-left font-medium text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>버전마케팅</th>
                      <th className={`px-4 py-3 text-left font-medium text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>버전번호</th>
                      <th className={`px-4 py-3 text-left font-medium text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>설명</th>
                      <th className={`px-4 py-3 text-left font-medium text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>등록일시</th>
                      <th className={`px-4 py-3 text-left font-medium text-gray-700 ${isMobile ? 'text-xs' : 'text-sm'}`}>참고</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="bg-blue-50 border-b border-gray-200">
                      <td className={`px-4 py-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        <span className="text-gray-600">상태 종류(2002)</span>
                      </td>
                      <td className={`px-4 py-2 text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>NO</td>
                      <td className={`px-4 py-2 text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>버전명 마케팅</td>
                      <td className={`px-4 py-2 text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>상세내용</td>
                      <td className={`px-4 py-2 text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>설명</td>
                      <td className={`px-4 py-2 text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>등록일시</td>
                    </tr>
                    {versions.map((version, index) => (
                      <tr 
                        key={version.id} 
                        className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
                        onClick={() => fetchVersionIssues(version)}
                      >
                        <td className={`px-4 py-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>{index + 1}</td>
                        <td className={`px-4 py-3 text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>{version.name}</td>
                        <td className={`px-4 py-3 text-gray-900 ${isMobile ? 'text-xs' : 'text-sm'}`}>{version.name}</td>
                        <td className={`px-4 py-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                            {version.status === 'open' ? '진행중' : version.status}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          {new Date(version.created_on).toLocaleDateString('ko-KR')}
                        </td>
                        <td className={`px-4 py-3 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                          <a
                            href={`https://projects.rsupport.com/projects/2024_qa_sebj/roadmap`}
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
            <div className="mt-4 md:mt-6 bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200 bg-blue-50">
                <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-gray-900`}>
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
                ) : isMobile ? (
                  /* 모바일 카드 형태 */
                  <div className="p-4 space-y-3">
                    {versionIssues.map((issue) => (
                      <div key={issue.id} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-blue-600">#{issue.id}</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                                {issue.status.name}
                              </span>
                            </div>
                            <h4 className="text-sm font-medium text-gray-900 line-clamp-2">{issue.subject}</h4>
                          </div>
                          <a
                            href={`https://projects.rsupport.com/issues/${issue.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium min-w-[44px] min-h-[44px] flex items-center justify-center"
                          >
                            보기
                          </a>
                        </div>
                        <div className="text-xs text-gray-600">
                          담당자: {issue.assigned_to?.name || '-'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* 데스크탑 테이블 형태 */
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