import { useState, useEffect } from "react";
import api from "../../api/axios";

export default function AdminBookListPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 기존 도서 목록 API 재활용 (관리자 전용 API가 있다면 교체)
    api
      .get("/api/books")
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("도서 로딩 실패:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-500 font-medium">
          관리자 데이터를 불러오고 있어요...
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-6xl">
      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        도서 관리
      </h2>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="p-4 text-sm font-bold text-gray-600 w-20 text-center">
                  ID
                </th>
                <th className="p-4 text-sm font-bold text-gray-600">도서명</th>
                <th className="p-4 text-sm font-bold text-gray-600 w-32">
                  저자
                </th>
                <th className="p-4 text-sm font-bold text-gray-600 w-32 text-right">
                  가격
                </th>
                <th className="p-4 text-sm font-bold text-gray-600 w-24 text-center">
                  재고
                </th>
                <th className="p-4 text-sm font-bold text-gray-600 w-40 text-center">
                  관리
                </th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr
                  key={book.bookId}
                  className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                >
                  <td className="p-4 text-center font-medium text-gray-500">
                    {book.bookId}
                  </td>
                  <td className="p-4 font-bold text-gray-900">{book.title}</td>
                  <td className="p-4 text-gray-600 text-sm">{book.author}</td>
                  <td className="p-4 text-right font-bold text-blue-600">
                    {book.price?.toLocaleString()}원
                  </td>
                  <td className="p-4 text-center font-medium text-gray-700">
                    {book.stock}
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                      수정
                    </button>
                    <button className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition">
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
