package com.market.backend.service;

import com.market.backend.domain.Book;
import com.market.backend.domain.Cart;
import com.market.backend.domain.CartItem;
import com.market.backend.domain.User;
import com.market.backend.dto.CartItemResponseDto;
import com.market.backend.dto.CartSyncRequestDto;
import com.market.backend.repository.BookRepository;
import com.market.backend.repository.CartRepository;
import com.market.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Slf4j // 로깅 기능을 위한 어노테이션 추가
@Service
@RequiredArgsConstructor
// 장바구니 관련 비즈니스 로직(조회, 동기화 등)을 처리하는 서비스 클래스임
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final BookRepository bookRepository;

    @Transactional(readOnly = true)
    public List<CartItemResponseDto> getCart(String email) {
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) {
            return List.of();
        }

        Cart cart = cartRepository.findByUser(user).orElse(null);
        if (cart == null) {
            return List.of();
        }

        // DB에 일시적으로 중복이 있더라도 프론트엔드로는 절대 중복해서 나가지 않도록 방어
        Map<Long, CartItem> uniqueItems = new HashMap<>();
        for (CartItem item : cart.getCartItems()) {
            if (!uniqueItems.containsKey(item.getBookId())) {
                uniqueItems.put(item.getBookId(), item);
            }
        }

        return uniqueItems.values().stream()
                .map(item -> {
                    Book book = bookRepository.findById(item.getBookId()).orElse(null);
                    if (book == null) return null;
                    return new CartItemResponseDto(
                            book.getBookId(),
                            book.getTitle(),
                            book.getPrice(),
                            item.getQuantity(),
                            book.getCoverImageUrl(),
                            book.getIsbn()
                    );
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    @Transactional
    public void syncCart(CartSyncRequestDto dto) {
        if (dto.userEmail() == null || dto.userEmail().isEmpty()) return;
        
        // 프론트엔드에서 실수로 items 배열을 보내지 않았을 경우 NullPointerException 방어
        if (dto.items() == null) {
            return;
        }

   

        User user = userRepository.findByEmail(dto.userEmail())
                .orElseGet(() -> {
                    try {
                        return userRepository.save(User.builder()
                                .email(dto.userEmail())
                                .password("OAUTH_PROTECTED")
                                .name(dto.userName() != null ? dto.userName() : dto.userEmail().split("@")[0])
                                .role(User.Role.USER)
                                .build());
                    } catch (DataIntegrityViolationException e) {
                        return userRepository.findByEmail(dto.userEmail())
                                .orElseThrow(() -> new RuntimeException("회원 조회 실패"));
                    }
                });

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));

        // 프론트엔드에서 넘어온 DTO 자체의 중복을 제거
        Map<Long, Integer> uniqueDtoItems = new HashMap<>();
        for (CartSyncRequestDto.CartItemDto itemDto : dto.items()) {
            uniqueDtoItems.put(itemDto.bookId(), itemDto.quantity());
        }

        List<CartItem> itemsToRemove = new ArrayList<>();
        Map<Long, CartItem> processedBooks = new HashMap<>();

        // 기존 DB 아이템을 순회하며 살릴 것과 지울 것을 분리
        for (CartItem item : cart.getCartItems()) {
            Long bookId = item.getBookId();
            
            if (uniqueDtoItems.containsKey(bookId) && !processedBooks.containsKey(bookId)) {
                item.updateQuantity(uniqueDtoItems.get(bookId));
                processedBooks.put(bookId, item);
            } else {
                itemsToRemove.add(item);
            }
        }

        // 실제 중복 및 삭제 항목 제거
        cart.getCartItems().removeAll(itemsToRemove);

        // 기존 DB에 없었던 새로운 항목 추가
        for (Map.Entry<Long, Integer> entry : uniqueDtoItems.entrySet()) {
            Long bookId = entry.getKey();
            if (!processedBooks.containsKey(bookId)) {
                CartItem newItem = CartItem.builder()
                        .cart(cart)
                        .bookId(bookId)
                        .quantity(entry.getValue())
                        .build();
                cart.getCartItems().add(newItem);
            }
        }
        
    }
}