package com.market.backend.dto;

import com.market.backend.domain.Order;
import com.market.backend.domain.OrderItem;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

// 주문 결과와 내역을 화면에 표시하기 위한 응답 DTO
public record OrderResponseDto(
        Long orderId,
        String recipient,
        String phone,
        String address,
        Integer totalPrice,
        String status,
        LocalDateTime orderDate,
        List<OrderItemResponseDto> items
) {
    public static OrderResponseDto from(Order order) {
        return new OrderResponseDto(
                order.getOrderId(),
                order.getRecipient(),
                order.getPhone(),
                order.getAddress(),
                order.getTotalPrice(),
                order.getStatus().name(),
                order.getOrderDate(),
                order.getItems().stream()
                        .map(OrderItemResponseDto::from)
                        .collect(Collectors.toList())
        );
    }

    public record OrderItemResponseDto(
            Long orderItemId,
            Long bookId,
            String title,
            Integer quantity,
            Integer price
    ) {
        public static OrderItemResponseDto from(OrderItem item) {
            return new OrderItemResponseDto(
                    item.getOrderItemId(),
                    item.getBookId(),
                    item.getTitle(),
                    item.getQuantity(),
                    item.getPrice()
            );
        }
    }
}