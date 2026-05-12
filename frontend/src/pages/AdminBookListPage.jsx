import { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function AdminBookListPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBooks = () => {
    api
      .get("/api/books")
      .then((res) => {
        // 데이터를 받아온 직후 bookId 기준으로 오름차순 정렬 처리
        const sortedBooks = res.data.sort((a, b) => a.bookId - b.bookId);
        setBooks(sortedBooks);
        setLoading(false);
      })
      .catch((err) => {
        console.error("도서 로딩 실패:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleDelete = async (id, title) => {
    if (
      window.confirm(
        `[${title}] 도서를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`,
      )
    ) {
      try {
        await api.delete(`/api/books/${id}`);
        setBooks((prevBooks) => prevBooks.filter((book) => book.bookId !== id));
        toast.success("성공적으로 삭제되었습니다.");
      } catch (err) {
        console.error("삭제 실패:", err);
        toast.error("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const getOriginLabel = (origin) => {
    if (origin === "DOMESTIC") return "국내";
    if (origin === "FOREIGN") return "해외";
    return "-";
  };

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
                <th className="p-4 text-sm font-bold text-gray-600 w-32 text-center">
                  구분/분야
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
                  <td className="p-4 text-center">
                    <span className="block text-xs font-bold text-purple-600 bg-purple-50 rounded-md py-0.5 mb-1">
                      {getOriginLabel(book.origin)}
                    </span>
                    <span className="block text-xs font-medium text-blue-600 bg-blue-50 rounded-md py-0.5">
                      {book.categoryName || "미지정"}
                    </span>
                  </td>
                  <td className="p-4 flex justify-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/admin/books/edit/${book.bookId}`)
                      }
                      className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(book.bookId, book.title)}
                      className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer"
                    >
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
