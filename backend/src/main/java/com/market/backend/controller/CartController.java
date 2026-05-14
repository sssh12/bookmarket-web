package com.market.backend.controller;

import com.market.backend.dto.CartItemResponseDto;
import com.market.backend.dto.CartSyncRequestDto;
import com.market.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carts")
@RequiredArgsConstructor
// 장바구니 관련 요청을 처리하는 REST 컨트롤러
public class CartController {

    private final CartService cartService;

    // 장바구니 조회 (로그인 시 디바이스 동기화용)
    @GetMapping
    public ResponseEntity<List<CartItemResponseDto>> getCart(@RequestParam("email") String email) {
        return ResponseEntity.ok(cartService.getCart(email));
    }

    // 장바구니 실시간 동기화 (수량 변경, 담기, 삭제 시 호출)
    @PostMapping("/sync")
    public ResponseEntity<Void> syncCart(@RequestBody CartSyncRequestDto dto) {
        cartService.syncCart(dto);
        return ResponseEntity.ok().build();
    }
}