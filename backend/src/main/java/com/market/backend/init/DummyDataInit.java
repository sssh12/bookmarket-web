package com.market.backend.init;

import com.market.backend.domain.Book;
import com.market.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DummyDataInit implements CommandLineRunner {

    private final BookRepository bookRepository;

    @Override
    public void run(String... args) throws Exception {
        // DB에 도서 데이터가 하나도 없을 때만 실행
        if (bookRepository.count() == 0) {
            Book book1 = Book.builder()
                    .isbn("ISBN1234")
                    .title("쉽게 배우는 JSP 웹 프로그래밍")
                    .price(27000)
                    .author("송미영")
                    .description("단계별로 쇼핑몰을 구현하며 배우는 JSP 웹 프로그래밍")
                    .publisher("한빛아카데미")
                    .stock(100)
                    .build();

            Book book2 = Book.builder()
                    .isbn("ISBN1235")
                    .title("안드로이드 프로그래밍")
                    .price(33000)
                    .author("우재남")
                    .description("실습 단계별 명쾌한 멘토링!")
                    .publisher("한빛아카데미")
                    .stock(100)
                    .build();

            Book book3 = Book.builder()
                    .isbn("ISBN1236")
                    .title("스크래치")
                    .price(22000)
                    .author("고광일")
                    .description("컴퓨팅 사고력을 키우는 블록 코딩")
                    .publisher("생능출판")
                    .stock(100)
                    .build();

            bookRepository.save(book1);
            bookRepository.save(book2);
            bookRepository.save(book3);
            
            System.out.println("✅ 초기 도서 데이터 3권이 DB에 세팅되었습니다.");
        }
    }
}
