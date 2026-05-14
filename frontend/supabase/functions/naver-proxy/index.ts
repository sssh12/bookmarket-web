Deno.serve(async (req: Request) => {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401 });

  // 네이버 실제 서버로 요청 전달
  const response = await fetch("https://openapi.naver.com/v1/nid/me", {
    headers: { Authorization: authHeader },
  });
  const data = await response.json();

  // 네이버 응답 데이터 추출
  const naverUser = data.response || {};

  // Supabase(OIDC 표준)가 인식할 수 있도록 매핑 추가
  if (naverUser.id) {
    naverUser.sub = String(naverUser.id); // provider id 에러 해결
  }
  if (naverUser.name) {
    naverUser.full_name = naverUser.name; // DB 트리거 이름 매핑 문제 해결
  }

  // 평탄화된 객체 반환
  return new Response(JSON.stringify(naverUser), {
    headers: { "Content-Type": "application/json" },
  });
});
