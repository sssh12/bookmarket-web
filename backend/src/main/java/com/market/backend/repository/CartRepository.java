package com.market.backend.repository;

import com.market.backend.domain.Cart;
import com.market.backend.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
// 사용자 장바구니 엔티티를 관리하는 저장소
public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}