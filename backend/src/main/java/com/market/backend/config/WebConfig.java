package com.market.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // 서버의 모든 API 경로에 대해
                // 프론트엔드 개발 서버의 주소를 허용
                .allowedOrigins("http://localhost:5173", "http://127.0.0.1:5173") 
                // 허용할 HTTP 메서드
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // 모든 헤더 허용
                .allowedHeaders("*")
                // 쿠키/인증 정보 포함 여부
                .allowCredentials(true)
                // 캐시 시간 (1시간)
                .maxAge(3600);
    }
}