package com.market.backend.controller;

import com.market.backend.dto.UserProfileRequestDto;
import com.market.backend.dto.UserResponseDto;
import com.market.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
// 사용자 정보와 프로필 수정 요청을 처리하는 REST 컨트롤러
public class UserController {

    private final UserService userService;

    @GetMapping("/{email}")
    public ResponseEntity<UserResponseDto> getUser(@PathVariable("email") String email) {
        return ResponseEntity.ok(userService.getUserByEmail(email));
    }

    @PutMapping("/{email}/address")
    public ResponseEntity<Void> updateAddress(
            @PathVariable("email") String email,
            @RequestBody Map<String, String> request
    ) {
        userService.updateAddress(email, request.get("address"));
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{email}/profile")
    public ResponseEntity<Void> updateProfile(
            @PathVariable("email") String email,
            @RequestBody UserProfileRequestDto request
    ) {
        userService.updateProfile(email, request.name(), request.phoneNumber(), request.address());
        return ResponseEntity.ok().build();
    }
}