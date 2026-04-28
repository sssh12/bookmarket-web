import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  proxy: {
    // /api 로 시작하는 요청은 백엔드 서버(8080)로 전달.
    "/api": {
      target: "http://127.0.0.1:8080", // localhost 대신 127.0.0.1로 고정
      changeOrigin: true,
    },
  },
});
