package com.market.backend.service;

import com.market.backend.domain.Book;
import com.market.backend.dto.BookRequestDto;
import com.market.backend.dto.BookResponseDto;
import com.market.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookService {

    private final BookRepository bookRepository;

    // 전체 도서 목록 조회
    public List<BookResponseDto> getAllBooks() {
        List<Book> books = bookRepository.findAll();
        return books.stream()
                .map(BookResponseDto::from)
                .collect(Collectors.toList());
    }

    // 단일 도서 상세 조회
    public BookResponseDto getBookById(Long id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 도서가 존재하지 않습니다. ID: " + id));
        return BookResponseDto.from(book);
    }

    @Transactional
    public void createBook(BookRequestDto requestDto) {
        Book book = requestDto.toEntity();
        bookRepository.save(book);
    }
}