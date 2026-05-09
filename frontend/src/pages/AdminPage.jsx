import { useForm } from "react-hook-form";
import api from "../../api/axios"; // 멘토링 반영: 전역 axios 인스턴스 사용
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const newBook = {
        ...data,
        price: parseInt(data.price),
        stock: parseInt(data.stock),
      };

      await api.post("/api/books", newBook);

      alert("✅ 도서가 성공적으로 등록되었습니다!");
      reset();
      navigate("/admin/books");
    } catch (error) {
      console.error(error);
      alert("도서 등록에 실패했습니다.");
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-2xl">
      <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-6">
        신규 도서 등록
      </h2>

      {/* 멘토링 반영: 토스 스타일 부드러운 폼 레이아웃 적용 */}
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              도서명 (Title)
            </label>
            <input
              type="text"
              {...register("title", { required: true })}
              className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-900"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                저자 (Author)
              </label>
              <input
                type="text"
                {...register("author", { required: true })}
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                출판사 (Publisher)
              </label>
              <input
                type="text"
                {...register("publisher", { required: true })}
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                ISBN
              </label>
              <input
                type="text"
                {...register("isbn")}
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                가격 (Price)
              </label>
              <input
                type="number"
                {...register("price", { required: true })}
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                재고 수량 (Stock)
              </label>
              <input
                type="number"
                {...register("stock", { required: true })}
                className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-900"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              도서 설명 (Description)
            </label>
            <textarea
              rows="4"
              {...register("description")}
              className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-gray-200 outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all font-medium text-gray-900 resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-bold py-4 mt-4 rounded-2xl transition-all duration-200 text-lg active:scale-95 shadow-sm ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-md"
            }`}
          >
            {isSubmitting ? "등록 중..." : "도서 등록하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
