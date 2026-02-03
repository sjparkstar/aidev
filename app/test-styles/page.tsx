export default function TestStyles() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          CSS 테스트 페이지
        </h1>
        <p className="text-gray-600 mb-4">
          Tailwind CSS가 제대로 작동하고 있습니다.
        </p>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
          테스트 버튼
        </button>
        <div className="mt-4 space-y-2">
          <div className="bg-red-100 text-red-800 p-2 rounded">빨간색 박스</div>
          <div className="bg-green-100 text-green-800 p-2 rounded">초록색 박스</div>
          <div className="bg-yellow-100 text-yellow-800 p-2 rounded">노란색 박스</div>
        </div>
      </div>
    </div>
  );
}