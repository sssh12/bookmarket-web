package com.market.backend.service;

import com.market.backend.domain.Cart;
import com.market.backend.domain.CartItem;
import com.market.backend.domain.User;
import com.market.backend.dto.CartSyncRequestDto;
import com.market.backend.repository.CartRepository;
import com.market.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final UserRepository userRepository;

    @Transactional
    public void syncCart(CartSyncRequestDto dto) {
        if (dto.userEmail() == null || dto.userEmail().isEmpty()) return;

        // 1. 유저 조회 또는 자동 생성 (user_tb 연동)
        User user = userRepository.findByEmail(dto.userEmail())
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(dto.userEmail())
                        .password("OAUTH_PROTECTED")
                        .name(dto.userName() != null ? dto.userName() : dto.userEmail().split("@")[0])
                        .role(User.Role.USER)
                        .build()));

        // 2. 해당 유저의 장바구니 조회 또는 생성 (cart_tb 연동)
        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(Cart.builder().user(user).build()));

        // 3. 기존 장바구니 아이템 비우기 (orphanRemoval 옵션으로 DB에서도 삭제됨)
        cart.getCartItems().clear();

        // 4. 프론트엔드에서 넘어온 최신 장바구니 아이템으로 채우기 (cart_item_tb 연동)
        for (CartSyncRequestDto.CartItemDto itemDto : dto.items()) {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .bookId(itemDto.bookId())
                    .quantity(itemDto.quantity())
                    .build();
            cart.getCartItems().add(newItem);
        }
    }
}