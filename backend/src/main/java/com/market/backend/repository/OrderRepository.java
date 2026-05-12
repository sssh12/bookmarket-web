package com.market.backend.repository;

import com.market.backend.domain.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    // 사용자의 이메일을 기반으로 주문 내역을 최신순으로 조회하는 쿼리 메서드
    List<Order> findByUser_EmailOrderByOrderIdDesc(String email);
}