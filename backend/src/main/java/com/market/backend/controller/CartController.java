package com.market.backend.controller;

import com.market.backend.dto.CartSyncRequestDto;
import com.market.backend.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @PostMapping("/sync")
    public ResponseEntity<Void> syncCart(@RequestBody CartSyncRequestDto dto) {
        cartService.syncCart(dto);
        return ResponseEntity.ok().build();
    }
}