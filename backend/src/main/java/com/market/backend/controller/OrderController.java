package com.market.backend.controller;

import com.market.backend.dto.OrderRequestDto;
import com.market.backend.dto.OrderResponseDto; // [추가]
import com.market.backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List; 

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    public ResponseEntity<Void> createOrder(@RequestBody OrderRequestDto requestDto) {
        orderService.createOrder(requestDto);
        return ResponseEntity.ok().build();
    }

    // 주문 내역 조회 GET API
    @GetMapping
    public ResponseEntity<List<OrderResponseDto>> getOrders(@RequestParam("email") String email) {
        List<OrderResponseDto> orders = orderService.getOrdersByEmail(email);
        return ResponseEntity.ok(orders);
    }
}