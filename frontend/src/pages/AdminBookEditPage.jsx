import { useForm } from "react-hook-form";
import api from "../../api/axios.js";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "../supabaseClient.js";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// 관리자용 도서 수정 화면
export default function AdminBookEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  // 실시간 에러 출력을 위한 mode: "onChange" 적용
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
  });

  const [uploading, setUploading] = useState(false);
  const [existingImage, setExistingImage] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchBookData = async () => {
      try {
        const response = await api.get(`/api/books/${id}`);
        const bookData = response.data;

        const categoryMap = {
          "소설/시/희곡": "1",
          "IT/모바일": "2",
          "경제/경영": "3",
          "인문/사회": "4",
          자기계발: "5",
          과학: "6",
          "만화/라이트노벨": "7",
        };

        const categoryId = categoryMap[bookData.categoryName] || "1";

        reset({
          title: bookData.title,
          author: bookData.author,
          publisher: bookData.publisher,
          price: bookData.price,
          isbn: bookData.isbn,
          description: bookData.description,
          categoryId: categoryId,
          origin: bookData.origin === "FOREIGN" ? "FOREIGN" : "DOMESTIC",
        });

        if (bookData.coverImageUrl) {
          setExistingImage(bookData.coverImageUrl);
        }
      } catch (error) {
        console.error("도서 정보 로딩 실패:", error);
        toast.error("도서 정보를 불러오는데 실패했습니다.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchBookData();
  }, [id, reset, navigate]);

  const onSubmit = async (data) => {
    try {
      setUploading(true);
      let coverImageUrl = existingImage;

      if (data.imageFile && data.imageFile.length > 0) {
        const file = data.imageFile[0];
        const fileExt = file.name.split(".").pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("book-images")
          .upload(fileName, file, {
            contentType: file.type,
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("book-images")
          .getPublicUrl(fileName);

        coverImageUrl = publicUrlData.publicUrl;
      }

      const updatedBook = {
        title: data.title,
        author: data.author,
        publisher: data.publisher,
        price: parseInt(data.price),
        isbn: data.isbn,
        description: data.description,
        categoryId: parseInt(data.categoryId),
        origin: data.origin,
        publishedAt: data.publishedAt,
        coverImageUrl: coverImageUrl,
      };

      await api.put(`/api/books/${id}`, updatedBook);

      toast.success("도서 정보가 성공적으로 수정되었습니다!");
      navigate("/admin/books");
    } catch (error) {
      console.error(error);
      toast.error("도서 수정 중 오류가 발생했습니다.");
    } finally {
      setUploading(false);
    }
  };

  const onError = (errors) => {
    console.error("폼 검증 실패:", errors);
    toast.error(
      "입력되지 않은 필수 항목이 있거나 입력 형식이 올바르지 않습니다.",
    );
  };

  if (loadingData)
    return (
      <div className="text-center mt-20 font-bold text-gray-500">
        데이터를 불러오는 중...⏳
      </div>
    );
  const isLoading = isSubmitting || uploading;

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-8">
        도서 정보 수정
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit, onError)}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              도서명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("title", { required: "도서명을 입력해주세요." })}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all font-medium ${errors.title ? "border-red-300 focus:bg-white focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"}`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1.5 ml-1 font-bold">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              저자 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("author", { required: "저자를 입력해주세요." })}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all font-medium ${errors.author ? "border-red-300 focus:bg-white focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"}`}
            />
            {errors.author && (
              <p className="text-red-500 text-sm mt-1.5 ml-1 font-bold">
                {errors.author.message}
              </p>
            )}
          </div>

          {/* [개선 1] 출판사 필수값 및 에러 렌더링 반영 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              출판사 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("publisher", { required: "출판사를 입력해주세요." })}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all font-medium ${errors.publisher ? "border-red-300 focus:bg-white focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"}`}
            />
            {errors.publisher && (
              <p className="text-red-500 text-sm mt-1.5 ml-1 font-bold">
                {errors.publisher.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              가격 (원) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              {...register("price", { required: "가격을 입력해주세요." })}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all font-medium ${errors.price ? "border-red-300 focus:bg-white focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"}`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1.5 ml-1 font-bold">
                {errors.price.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              도서 구분 <span className="text-red-500">*</span>
            </label>
            <select
              {...register("origin", { required: "도서 구분을 선택해주세요." })}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all font-medium cursor-pointer ${errors.origin ? "border-red-300 focus:bg-white focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"}`}
            >
              <option value="">구분을 선택하세요</option>
              <option value="DOMESTIC">국내 도서</option>
              <option value="FOREIGN">해외 도서</option>
            </select>
            {errors.origin && (
              <p className="text-red-500 text-sm mt-1.5 ml-1 font-bold">
                {errors.origin.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              분야 (카테고리) <span className="text-red-500">*</span>
            </label>
            <select
              {...register("categoryId", { required: "분야를 선택해주세요." })}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all font-medium cursor-pointer ${errors.categoryId ? "border-red-300 focus:bg-white focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"}`}
            >
              <option value="">분야를 선택하세요</option>
              <option value="1">소설/시/희곡</option>
              <option value="2">IT/모바일</option>
              <option value="3">경제/경영</option>
              <option value="4">인문/사회</option>
              <option value="5">자기계발</option>
              <option value="6">과학</option>
              <option value="7">만화/라이트노벨</option>
            </select>
            {errors.categoryId && (
              <p className="text-red-500 text-sm mt-1.5 ml-1 font-bold">
                {errors.categoryId.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              출판일 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              {...register("publishedAt", {
                required: "출판일을 입력해주세요.",
              })}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all font-medium ${errors.publishedAt ? "border-red-300 focus:bg-white focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"}`}
            />
            {errors.publishedAt && (
              <p className="text-red-500 text-sm mt-1.5 ml-1 font-bold">
                {errors.publishedAt.message}
              </p>
            )}
          </div>

          {/* [개선 1] ISBN 필수값 및 에러 렌더링 반영 */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              ISBN <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("isbn", { required: "ISBN을 입력해주세요." })}
              className={`w-full px-4 py-3 bg-gray-50 rounded-xl border outline-none transition-all font-medium ${errors.isbn ? "border-red-300 focus:bg-white focus:ring-2 focus:ring-red-500" : "border-gray-200 focus:bg-white focus:ring-2 focus:ring-blue-500"}`}
            />
            {errors.isbn && (
              <p className="text-red-500 text-sm mt-1.5 ml-1 font-bold">
                {errors.isbn.message}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              도서 이미지{" "}
              <span className="text-gray-400 font-normal ml-1">(선택)</span>
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("imageFile")}
              className="w-full px-4 py-2.5 bg-gray-50 rounded-xl border border-gray-200 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition-all cursor-pointer"
            />
            {existingImage && (
              <p className="text-xs text-blue-500 mt-2 font-bold">
                ✓ 현재 이미지가 등록되어 있습니다.
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              도서 설명{" "}
              <span className="text-gray-400 font-normal ml-1">(선택)</span>
            </label>
            <textarea
              rows="4"
              {...register("description")}
              className="w-full px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all font-medium resize-none"
            ></textarea>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate("/admin/books")}
            className="w-1/3 text-gray-600 font-bold py-4 rounded-2xl transition-all duration-200 text-lg bg-gray-100 hover:bg-gray-200 active:scale-[0.98] cursor-pointer"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-2/3 text-white font-bold py-4 rounded-2xl transition-all duration-200 text-lg shadow-sm cursor-pointer ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 active:scale-[0.98]"
            }`}
          >
            {uploading
              ? "이미지 업로드 중..."
              : isSubmitting
                ? "수정 중..."
                : "수정 완료"}
          </button>
        </div>
      </form>
    </div>
  );
}
