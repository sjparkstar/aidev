'use client';

import { useState, useEffect } from 'react';

interface Project {
  id: number;
  identifier: string;
  name: string;
  description?: string;
  status: number;
  created_on: string;
  updated_on: string;
}

interface Version {
  id: number;
  name: string;
  description?: string;
  status: string;
  sharing?: string;
  due_date?: string;
  created_on: string;
  updated_on: string;
  project?: {
    id: number;
    name: string;
  };
}

interface Issue {
  id: number;
  subject: string;
  description?: string;
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
  category?: {
    id: number;
    name: string;
  };
  tracker?: {
    id: number;
    name: string;
  };
  fixed_version?: {
    id: number;
    name: string;
  };
  author?: {
    id: number;
    name: string;
  };
  start_date?: string;
  due_date?: string;
  done_ratio: number;
  estimated_hours?: number;
  spent_hours?: number;
  created_on: string;
  updated_on: string;
  project: {
    id: number;
    name: string;
  };
}



export default function SimpleRoadmapBoard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [versionIssues, setVersionIssues] = useState<{ [versionId: number]: Issue[] }>({});
  const [expandedVersions, setExpandedVersions] = useState<{ [versionId: number]: boolean }>({});
  const [loading, setLoading] = useState(true);
  const [issuesLoading, setIssuesLoading] = useState<{ [versionId: number]: boolean }>({});
  const [error, setError] = useState<string | null>(null);
  
  // 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  
  // 필터 상태
  const [selectedVersionFilter, setSelectedVersionFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // 상세보기 상태
  const [showDetailedView, setShowDetailedView] = useState(false);
  
  // 정렬 상태
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // 메뉴 드롭다운 상태 관리
  const [menuStates, setMenuStates] = useState({
    redmine: true,  // Redmine v7 메뉴 (기본 열림)
    login: true,    // 일반 로그인 관리 (기본 열림)
    network: false  // 네트워크 관리 (기본 닫힘)
  });
  
  // 선택된 메뉴 상태 관리
  const [selectedMenu, setSelectedMenu] = useState<string>('redmine-all-issues'); // 기본 선택: 전체 개발 일감
  
  // 메뉴 토글 함수
  const toggleMenu = (menuKey: keyof typeof menuStates) => {
    setMenuStates(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };
  
  // 메뉴 선택 함수
  const selectMenu = (menuId: string) => {
    setSelectedMenu(menuId);
  };
  
  // 선택된 메뉴에 따른 제목 및 경로 가져오기
  const getMenuInfo = (menuId: string) => {
    const menuMap: Record<string, { title: string; breadcrumb: string }> = {
      'redmine': { title: 'Redmine v7 개발 관리', breadcrumb: 'Redmine > 전체 개발' },
      'redmine-all-issues': { 
        title: projects.length > 0 ? projects[0].name : '프로젝트 로딩 중...', 
        breadcrumb: 'Redmine v7 > 전체 개발 일감' 
      },
      'redmine-sprint': { title: '스프린트 관리', breadcrumb: 'Redmine v7 > 스프린트' },
      'login-management': { title: '일반 로그인 관리 생성법', breadcrumb: '일반 사용자 → 일반 사용자 → 일반 로그인 생성법' },
      'login-history': { title: '일반 등록관리 내역', breadcrumb: '일반 로그인 관리 > 등록관리 내역' },
      'login-requests': { title: '일반 등록요청 내역', breadcrumb: '일반 로그인 관리 > 등록요청 내역' },
      'login-pending': { title: '미승인 요청관리', breadcrumb: '일반 로그인 관리 > 미승인 요청관리' },
      'login-deleted': { title: '삭제된 사용자 목록', breadcrumb: '일반 로그인 관리 > 삭제된 사용자 목록' },
      'network': { title: '네트워크 관리', breadcrumb: '네트워크 > 전체 관리' },
      'network-settings': { title: '네트워크 설정', breadcrumb: '네트워크 관리 > 네트워크 설정' },
      'network-firewall': { title: '방화벽 관리', breadcrumb: '네트워크 관리 > 방화벽 관리' },
      'network-monitoring': { title: '트래픽 모니터링', breadcrumb: '네트워크 관리 > 트래픽 모니터링' }
    };
    
    return menuMap[menuId] || { title: '전체 개발 일감', breadcrumb: 'Redmine v7 > 전체 개발 일감' };
  };
  
  const currentMenuInfo = getMenuInfo(selectedMenu);

  // 2024_qa_sebj 프로젝트와 서브프로젝트의 모든 버전 가져오기
  useEffect(() => {
    const fetchAllVersions = async () => {
      if (selectedMenu !== 'redmine-all-issues') {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('🚀 Fetching versions...');
        const response = await fetch('/api/redmine/projects/2024_qa_sebj/all-versions');
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ API Error:', response.status, errorText);
          throw new Error(`API Error: ${response.status} - ${errorText}`);
        }
        
        const data = await response.json();
        console.log('📊 Data received:', data);
        
        setVersions(data.versions || []);
        setProjects(data.projects || []);
        console.log('📊 Main project name:', data.projects?.[0]?.name);
      } catch (err) {
        console.error('Error fetching versions:', err);
        setError(
          err instanceof Error 
            ? `버전 목록을 불러오는데 실패했습니다: ${err.message}`
            : '버전 목록을 불러오는데 실패했습니다.'
        );
      } finally {
        setLoading(false);
      }
    };

    // 비동기 호출
    fetchAllVersions();
  }, [selectedMenu]);

  // 버전별 이슈 가져오기
  const fetchVersionIssues = async (version: Version) => {
    setIssuesLoading(prev => ({ ...prev, [version.id]: true }));
    try {
      const response = await fetch(
        `/api/redmine/issues?project_id=${version.project?.id}&fixed_version_id=${version.id}&limit=50`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch version issues');
      }
      const data = await response.json();
      
      setVersionIssues(prev => ({
        ...prev,
        [version.id]: data.issues || []
      }));
    } catch (err) {
      console.error('Error fetching version issues:', err);
    } finally {
      setIssuesLoading(prev => ({ ...prev, [version.id]: false }));
    }
  };

  // 버전 토글 함수
  const toggleVersionExpansion = (versionId: number) => {
    setExpandedVersions(prev => ({
      ...prev,
      [versionId]: !prev[versionId]
    }));
  };



  // 버전 번호 추출 함수
  const extractVersionNumber = (versionName: string): string => {
    // 정규식으로 X.Y.Z 패턴의 버전 번호 추출
    const versionMatch = versionName.match(/(\d+\.\d+\.\d+)/);;
    return versionMatch ? versionMatch[1] : versionName;
  };

  // 버전 비교 함수 (semantic version comparison)
  const compareVersions = (a: string, b: string): number => {
    const versionA = extractVersionNumber(a).split('.').map(num => parseInt(num, 10));
    const versionB = extractVersionNumber(b).split('.').map(num => parseInt(num, 10));
    
    for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
      const numA = versionA[i] || 0;
      const numB = versionB[i] || 0;
      
      if (numA !== numB) {
        return numA - numB;
      }
    }
    
    // 버전 번호가 같으면 전체 문자열로 비교
    return a.localeCompare(b);
  };

  // 필터링된 버전 목록
  const filteredVersions = versions.filter(version => {
    if (selectedVersionFilter && version.id.toString() !== selectedVersionFilter) {
      return false;
    }
    if (searchTerm && !version.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    return true;
  });

  // 정렬된 버전 목록
  const sortedVersions = [...filteredVersions].sort((a, b) => {
    const comparison = compareVersions(a.name, b.name);
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // 정렬 토글 함수
  const toggleSort = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  // 페이징된 버전 목록
  const paginatedVersions = sortedVersions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 통계 계산
  const totalIssues = Object.values(versionIssues).reduce((acc, issues) => acc + issues.length, 0);

  // 상태에 따른 색상 반환
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'new':
      case 'open':
        return 'bg-blue-100 text-blue-800';
      case 'in progress':
      case 'assigned':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
      case 'feedback':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 우선순위에 따른 색상 반환
  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'immediate':
      case 'urgent':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'normal':
        return 'bg-blue-100 text-blue-800';
      case 'low':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // 진척도 바 컴포넌트
  const ProgressBar = ({ progress }: { progress: number }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-blue-600 h-2 rounded-full" 
        style={{ width: `${Math.min(progress, 100)}%` }}
      ></div>
    </div>
  );

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
                <span className="font-semibold">RemoteCall Manager</span>
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
            
            {/* Redmine v7 */}
            <div>
              <button 
                onClick={() => {
                  toggleMenu('redmine');
                  selectMenu('redmine');
                }}
                className={`font-medium mb-2 flex items-center justify-between w-full px-2 py-1 rounded transition-colors ${
                  selectedMenu === 'redmine' 
                    ? 'bg-slate-700 text-white' 
                    : 'text-white hover:bg-slate-700'
                }`}
              >
                <span>Redmine v7</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    menuStates.redmine ? 'rotate-180' : 'rotate-0'
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div 
                className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ${
                  menuStates.redmine ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div 
                  onClick={() => selectMenu('redmine-all-issues')}
                  className={`text-sm py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedMenu === 'redmine-all-issues' 
                      ? 'bg-slate-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  전체 개발 일감
                </div>
                <div 
                  onClick={() => selectMenu('redmine-sprint')}
                  className={`text-sm py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedMenu === 'redmine-sprint' 
                      ? 'bg-slate-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  스프린트
                </div>
              </div>
            </div>

            {/* 일반 로그인 관리 */}
            <div className={`rounded px-3 py-2 ${
              selectedMenu.startsWith('login') ? 'bg-blue-600' : 'bg-blue-500'
            }`}>
              <button 
                onClick={() => {
                  toggleMenu('login');
                  selectMenu('login-management');
                }}
                className={`font-medium mb-2 flex items-center justify-between w-full px-2 py-1 rounded transition-colors ${
                  selectedMenu === 'login-management' 
                    ? 'bg-blue-700 text-white' 
                    : 'text-white hover:bg-blue-700'
                }`}
              >
                <span>일반 로그인 관리</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    menuStates.login ? 'rotate-180' : 'rotate-0'
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div 
                className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ${
                  menuStates.login ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div 
                  onClick={() => selectMenu('login-history')}
                  className={`text-sm py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedMenu === 'login-history' 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  일반 등록관리 내역
                </div>
                <div 
                  onClick={() => selectMenu('login-requests')}
                  className={`text-sm py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedMenu === 'login-requests' 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  일반 등록요청 내역
                </div>
                <div 
                  onClick={() => selectMenu('login-pending')}
                  className={`text-sm py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedMenu === 'login-pending' 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  미승인 요청관리
                </div>
                <div 
                  onClick={() => selectMenu('login-deleted')}
                  className={`text-sm py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedMenu === 'login-deleted' 
                      ? 'bg-blue-700 text-white' 
                      : 'text-blue-100 hover:text-white hover:bg-blue-700'
                  }`}
                >
                  삭제된 사용자 목록
                </div>
              </div>
            </div>

            {/* 네트워크 관리 */}
            <div>
              <button 
                onClick={() => {
                  toggleMenu('network');
                  selectMenu('network');
                }}
                className={`font-medium mb-2 flex items-center justify-between w-full px-2 py-1 rounded transition-colors ${
                  selectedMenu === 'network' 
                    ? 'bg-slate-700 text-white' 
                    : 'text-white hover:bg-slate-700'
                }`}
              >
                <span>네트워크 관리</span>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${
                    menuStates.network ? 'rotate-180' : 'rotate-0'
                  }`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div 
                className={`ml-4 space-y-1 overflow-hidden transition-all duration-300 ${
                  menuStates.network ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div 
                  onClick={() => selectMenu('network-settings')}
                  className={`text-sm py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedMenu === 'network-settings' 
                      ? 'bg-slate-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  네트워크 설정
                </div>
                <div 
                  onClick={() => selectMenu('network-firewall')}
                  className={`text-sm py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedMenu === 'network-firewall' 
                      ? 'bg-slate-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  방화벽 관리
                </div>
                <div 
                  onClick={() => selectMenu('network-monitoring')}
                  className={`text-sm py-1 px-2 rounded cursor-pointer transition-colors ${
                    selectedMenu === 'network-monitoring' 
                      ? 'bg-slate-600 text-white' 
                      : 'text-gray-300 hover:text-white hover:bg-slate-600'
                  }`}
                >
                  트래픽 모니터링
                </div>
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
              <h1 className="text-xl font-semibold text-gray-900">{currentMenuInfo.title}</h1>
              <p className="text-sm text-gray-600 mt-1">{currentMenuInfo.breadcrumb}</p>
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
            </div>
          </div>
        </div>

        {/* 메인 바디 */}
        <div className="flex-1 p-6 overflow-y-auto">
          {selectedMenu === 'redmine-all-issues' ? (
            <div className="space-y-6">
              {/* 상단 필터 영역 */}
              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-700">버전 선택</label>
                    <select 
                      value={selectedVersionFilter} 
                      onChange={(e) => setSelectedVersionFilter(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm min-w-[200px]"
                    >
                      <option value="">전체 버전</option>
                      {versions.map((version) => (
                        <option key={version.id} value={version.id.toString()}>
                          {version.name} ({version.project?.name})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      placeholder="버전명 검색"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm w-64"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={toggleSort}
                      className="flex items-center space-x-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50 transition-colors"
                      title={`버전명 ${sortOrder === 'asc' ? '오름차순' : '내림차순'} 정렬`}
                    >
                      <span>버전 정렬</span>
                      <svg className={`w-4 h-4 transition-transform ${sortOrder === 'desc' ? 'rotate-180' : 'rotate-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 10l5 5 5-5H7z" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => setShowDetailedView(!showDetailedView)}
                      className={`px-4 py-1 rounded text-sm transition-colors ${
                        showDetailedView 
                          ? 'bg-blue-600 text-white' 
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {showDetailedView ? '기본보기' : '상세보기'}
                    </button>
                  </div>
                </div>
                
                {/* 통계 정보 */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-sm text-blue-600">포함된 프로젝트</div>
                    <div className="text-lg font-bold text-blue-800">{projects.length}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="text-sm text-green-600">전체 버전</div>
                    <div className="text-lg font-bold text-green-800">
                      {sortedVersions.length}
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded">
                    <div className="text-sm text-yellow-600">로드된 이슈</div>
                    <div className="text-lg font-bold text-yellow-800">
                      {totalIssues}
                    </div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="text-sm text-purple-600">페이지당 버전</div>
                    <div className="text-lg font-bold text-purple-800">
                      {paginatedVersions.length}
                    </div>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="text-gray-600 mt-2">버전 정보를 불러오는 중...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-12">
                  <p className="text-red-600">{error}</p>
                </div>
              ) : (
                <>
                  {/* 버전별 이슈 표시 */}
                  <div className="space-y-4">
                    {paginatedVersions.map((version) => {
                      const issues = versionIssues[version.id] || [];
                      const isExpanded = expandedVersions[version.id];
                      const hasIssues = issues.length > 0;
                      const isLoading = issuesLoading[version.id];
                      
                      return (
                        <div key={version.id} className="bg-white rounded-lg border border-gray-200">
                          {/* 버전 헤더 */}
                          <div 
                            className="p-4 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-200"
                            onClick={() => {
                              if (!hasIssues && !isLoading) {
                                fetchVersionIssues(version);
                              }
                              toggleVersionExpansion(version.id);
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <svg 
                                    className={`w-4 h-4 transition-transform ${
                                      isExpanded ? 'rotate-90' : 'rotate-0'
                                    }`} 
                                    fill="currentColor" 
                                    viewBox="0 0 20 20"
                                  >
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                  <span className="font-semibold text-lg text-gray-900">{version.name}</span>
                                </div>
                                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">({version.project?.name})</span>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  version.status === 'open' ? 'bg-green-100 text-green-800' :
                                  version.status === 'closed' ? 'bg-gray-100 text-gray-800' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {version.status === 'open' ? '진행중' : 
                                   version.status === 'closed' ? '종료' : version.status}
                                </span>
                                {hasIssues && (
                                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    이슈 {issues.length}개
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                {version.due_date && (
                                  <span>마감일: {new Date(version.due_date).toLocaleDateString('ko-KR')}</span>
                                )}
                                <span>등록: {new Date(version.created_on).toLocaleDateString('ko-KR')}</span>
                                <a
                                  href={`https://projects.rsupport.com/projects/${version.project?.id}/roadmap`}
                                  /* href={`https://projects.rsupport.com/projects/${version.project?.identifier}/roadmap`} */
                                 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:text-blue-800"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Redmine에서 보기 →
                                </a>
                              </div>
                            </div>
                            {version.description && (
                              <p className="text-sm text-gray-600 mt-2 ml-6">{version.description}</p>
                            )}
                          </div>

                          {/* 버전 이슈 목록 */}
                          {isExpanded && (
                            <div className="p-4">
                              {isLoading ? (
                                <div className="flex items-center justify-center py-8">
                                  <div className="text-center">
                                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                    <p className="text-gray-600 mt-2">이슈를 불러오는 중...</p>
                                  </div>
                                </div>
                              ) : issues.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                  이 버전에 등록된 이슈가 없습니다.
                                </div>
                              ) : (
                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm">
                                    <thead className="bg-gray-50">
                                      <tr>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">제목</th>
                                        {showDetailedView && (
                                          <>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">우선순위</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">담당자</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">범주</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">시작일</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">종료일</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">진척도</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">예상시간</th>
                                            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">소요시간</th>
                                          </>
                                        )}
                                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">링크</th>
                                      </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                      {issues.map((issue) => (
                                        <tr key={issue.id} className="hover:bg-gray-50">
                                          <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-blue-600">
                                            #{issue.id}
                                          </td>
                                          <td className="px-3 py-2 text-sm text-gray-900 max-w-xs truncate" title={issue.subject}>
                                            {issue.subject}
                                          </td>
                                          {showDetailedView && (
                                            <>
                                              <td className="px-3 py-2 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(issue.status.name)}`}>
                                                  {issue.status.name}
                                                </span>
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(issue.priority.name)}`}>
                                                  {issue.priority.name}
                                                </span>
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {issue.assigned_to?.name || '-'}
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">
                                                {issue.category?.name || '-'}
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {issue.start_date ? new Date(issue.start_date).toLocaleDateString('ko-KR') : '-'}
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {issue.due_date ? new Date(issue.due_date).toLocaleDateString('ko-KR') : '-'}
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap text-sm">
                                                <div className="flex items-center space-x-2">
                                                  <ProgressBar progress={issue.done_ratio} />
                                                  <span className="text-xs text-gray-600 min-w-[30px]">{issue.done_ratio}%</span>
                                                </div>
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {issue.estimated_hours ? `${issue.estimated_hours}h` : '-'}
                                              </td>
                                              <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                                                {issue.spent_hours ? `${issue.spent_hours}h` : '-'}
                                              </td>
                                            </>
                                          )}
                                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                                            <a
                                              href={`https://projects.rsupport.com/issues/${issue.id}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                              className="text-blue-600 hover:text-blue-800"
                                            >
                                              보기
                                            </a>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* 페이징 */}
                  {sortedVersions.length > itemsPerPage && (
                    <div className="bg-white rounded-lg border border-gray-200 p-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-700">
                          {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, sortedVersions.length)} / {sortedVersions.length} 버전
                          <span className="ml-2 text-xs text-gray-500">
                            ({sortOrder === 'asc' ? '오름차순' : '내림차순'} 정렬)
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                          >
                            이전
                          </button>
                          <span className="text-sm text-gray-700">
                            {currentPage} / {Math.ceil(sortedVersions.length / itemsPerPage)}
                          </span>
                          <button
                            onClick={() => setCurrentPage(prev => Math.min(Math.ceil(sortedVersions.length / itemsPerPage), prev + 1))}
                            disabled={currentPage >= Math.ceil(sortedVersions.length / itemsPerPage)}
                            className="px-3 py-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
                          >
                            다음
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            /* 기존 기본 콘텐츠 */
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 mb-2">{currentMenuInfo.title}</h3>
                <p className="text-gray-600">이 메뉴를 선택했습니다.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}