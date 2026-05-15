package com.market.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HealthController {

    // UptimeRobot이 찌를 가벼운 상태 확인용 API
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        // 200 OK 상태 코드와 함께 단순한 문자열을 반환합니다.
        return ResponseEntity.ok("서버가 정상적으로 작동 중입니다.");
    }
}