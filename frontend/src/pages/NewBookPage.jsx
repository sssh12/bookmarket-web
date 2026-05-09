export default function NewBookPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <div className="flex items-center gap-3 mb-8">
        <span className="text-3xl">✨</span>
        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
          신간 도서
        </h2>
      </div>

      <div className="bg-white rounded-3xl p-10 shadow-sm border border-gray-100 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">
          최신 출간된 도서 데이터를 준비 중입니다...
        </p>
      </div>
    </div>
  );
}
