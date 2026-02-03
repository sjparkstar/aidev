import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Redmine 관리 서비스
        </h1>
        
        <div className="space-y-4">
          <Link 
            href="/roadmap-board"
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center block"
          >
            게시판 이동
          </Link>
          
          <Link 
            href="/test-styles"
            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors text-center block"
          >
            CSS 테스트
          </Link>
          
          <div className="text-sm text-gray-600 text-center">
            RemoteCall 관리 Redmine 게시판
          </div>
        </div>
      </div>
    </div>
  );
}