package com.market.backend.controller;

import com.market.backend.dto.BookResponseDto;
import com.market.backend.dto.WishlistRequestDto;
import com.market.backend.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlists")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<BookResponseDto>> getWishlist(@RequestParam("email") String email) {
        return ResponseEntity.ok(wishlistService.getWishlist(email));
    }

    @PostMapping("/toggle")
    public ResponseEntity<Void> toggleWishlist(@RequestBody WishlistRequestDto requestDto) {
        wishlistService.toggleWishlist(requestDto);
        return ResponseEntity.ok().build();
    }
}