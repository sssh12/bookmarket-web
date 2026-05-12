package com.market.backend.controller;

import com.market.backend.dto.BookRequestDto;
import com.market.backend.dto.BookResponseDto;
import com.market.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
public class BookController {

    private final BookService bookService;

    @GetMapping
    public ResponseEntity<List<BookResponseDto>> getAllBooks() {
        return ResponseEntity.ok(bookService.getAllBooks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BookResponseDto> getBookById(@PathVariable Long id) {
        return ResponseEntity.ok(bookService.getBookById(id));
    }

    // [기능 추가] 실제 판매량 기준 베스트셀러 조회 (카테고리 필터 포함)
    @GetMapping("/bestsellers")
    public ResponseEntity<List<BookResponseDto>> getBestsellers(
            @RequestParam(value = "categoryId", required = false) Long categoryId) {
        return ResponseEntity.ok(bookService.getBestsellers(categoryId));
    }

    @PostMapping
    public ResponseEntity<Void> createBook(@RequestBody BookRequestDto requestDto) {
        bookService.createBook(requestDto);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Void> updateBook(@PathVariable Long id, @RequestBody BookRequestDto requestDto) {
        bookService.updateBook(id, requestDto);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok().build();
    }
}