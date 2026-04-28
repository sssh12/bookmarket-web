import { useForm } from "react-hook-form";
import axios from "axios";
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
      // 폼 데이터의 숫자 타입 변환
      const newBook = {
        ...data,
        price: parseInt(data.price),
        stock: parseInt(data.stock),
      };

      // 백엔드 도서 등록 API 호출
      await axios.post("http://127.0.0.1:8080/api/books", newBook);

      alert("✅ 도서가 성공적으로 등록되었습니다!");
      reset(); // 폼 초기화
      navigate("/books"); // 도서 목록으로 이동하여 확인
    } catch (error) {
      console.error(error);
      alert("도서 등록에 실패했습니다.");
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6 border-b pb-2 text-yellow-600">
        관리자 - 신규 도서 등록
      </h2>

      <div className="bg-white p-6 rounded-lg shadow border">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-1">
                도서명 (Title)
              </label>
              <input
                {...register("title", { required: true })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                저자 (Author)
              </label>
              <input
                {...register("author", { required: true })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                출판사 (Publisher)
              </label>
              <input
                {...register("publisher")}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">ISBN</label>
              <input
                {...register("isbn")}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                가격 (Price)
              </label>
              <input
                type="number"
                {...register("price", { required: true })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-bold mb-1">
                재고 수량 (Stock)
              </label>
              <input
                type="number"
                {...register("stock", { required: true })}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold mb-1">
              도서 설명 (Description)
            </label>
            <textarea
              rows="4"
              {...register("description")}
              className="w-full px-3 py-2 border rounded"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-yellow-500 text-white font-bold py-3 rounded hover:bg-yellow-600 transition mt-4"
          >
            {isSubmitting ? "등록 중..." : "도서 등록하기"}
          </button>
        </form>
      </div>
    </div>
  );
}
