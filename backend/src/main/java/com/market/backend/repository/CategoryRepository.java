package com.market.backend.repository;

import com.market.backend.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// 카테고리 조회를 위한 새로운 레포지토리 인터페이스 생성
@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
}