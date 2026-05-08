import { Link } from "react-router-dom";

export default function PlaceholderPage() {
  return (
    <div className="container mx-auto p-10 flex flex-col items-center justify-center h-[70vh]">
      <div className="text-6xl mb-6">🚧</div>
      <h2 className="text-3xl font-bold text-gray-800 mb-4">
        페이지 준비 중입니다
      </h2>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        해당 기능은 현재 개발이 진행 중인 기능입니다.
        <br />더 나은 서비스를 위해 조금만 기다려주세요!
      </p>
      <Link
        to="/books"
        className="bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 transition"
      >
        상품 목록으로 돌아가기
      </Link>
    </div>
  );
}
