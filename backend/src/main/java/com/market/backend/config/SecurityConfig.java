package com.market.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
// API 접근 정책과 보안 관련 기본 설정을 정의하는 클래스
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // REST API 서버이므로 CSRF 보호를 비활성화
            .csrf(AbstractHttpConfigurer::disable)
            
            // HTTP 요청에 대한 권한을 설정
            .authorizeHttpRequests(auth -> auth
                // /api/books 및 그 하위 경로는 로그인 없이 누구나(permitAll) 접근 가능하도록 설정
                .requestMatchers("/api/books/**").permitAll()
                
                // 그 외의 모든 요청도 현재 개발 단계에서는 임시로 모두 허용
                // (추후 관리자/회원 기능 개발 시 이 부분을 제한할 예정입니다)
                .anyRequest().permitAll()
            );
            
        return http.build();
    }
}