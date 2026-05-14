package com.market.backend.init;

import com.market.backend.domain.Book;
import com.market.backend.domain.Category;
import com.market.backend.repository.BookRepository;
import com.market.backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
// 개발 환경에서 사용할 샘플 데이터를 초기화하는 클래스
public class DummyDataInit implements CommandLineRunner {

    private final BookRepository bookRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public void run(String... args) throws Exception {
        // 1. 카테고리(분야) 초기 데이터 자동 세팅
        // 프론트엔드 AdminPage.jsx의 <select> option 값(1~7)과 완벽히 동기화
        if (categoryRepository.count() == 0) {
            List<String> categoryNames = Arrays.asList(
                    "소설/시/희곡", "IT/모바일", "경제/경영", 
                    "인문/사회", "자기계발", "과학", "만화/라이트노벨"
            );
            for (String name : categoryNames) {
                categoryRepository.save(Category.builder().categoryName(name).build());
            }
        }

        // 2. 도서 초기 데이터 세팅 (DB에 도서가 없을 때만)
        if (bookRepository.count() == 0) {
            // ID 2번에 해당하는 "IT/모바일" 카테고리를 불러와서 매핑 준비
            Category itCategory = categoryRepository.findById(2).orElseThrow(
                () -> new RuntimeException("카테고리 초기화 오류")
            );

            Book book1 = Book.builder()
                    .isbn("ISBN1234")
                    .title("쉽게 배우는 JSP 웹 프로그래밍")
                    .price(27000)
                    .author("송미영")
                    .description("단계별로 쇼핑몰을 구현하며 배우는 JSP 웹 프로그래밍")
                    .publisher("한빛아카데미")
                    .origin(Book.Origin.DOMESTIC)
                    .category(itCategory) // [리팩토링] 카테고리 매핑
                    .publishedAt(LocalDateTime.of(2018, 10, 6, 0, 0))
                    .build();

            Book book2 = Book.builder()
                    .isbn("ISBN1235")
                    .title("안드로이드 프로그래밍")
                    .price(33000)
                    .author("우재남")
                    .description("실습 단계별 명쾌한 멘토링!")
                    .publisher("한빛아카데미")
                    .origin(Book.Origin.DOMESTIC)
                    .category(itCategory)
                    .publishedAt(LocalDateTime.of(2022, 1, 22, 0, 0))
                    .build();

            Book book3 = Book.builder()
                    .isbn("ISBN1236")
                    .title("스크래치")
                    .price(22000)
                    .author("고광일")
                    .description("컴퓨팅 사고력을 키우는 블록 코딩")
                    .publisher("생능출판")
                    .origin(Book.Origin.DOMESTIC)
                    .category(itCategory)
                    .publishedAt(LocalDateTime.of(2019, 6, 10, 0, 0))
                    .build();

            bookRepository.saveAll(Arrays.asList(book1, book2, book3));
        }
    }
}