package com.market.backend.service;

import com.market.backend.domain.User;
import com.market.backend.dto.UserResponseDto;
import com.market.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public UserResponseDto getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        return new UserResponseDto(user.getEmail(), user.getName(), user.getPhoneNumber(), user.getAddress());
    }

    @Transactional
    public void updateAddress(String email, String address) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));
        user.updateAddress(address);
    }

    @Transactional
    public void updateProfile(String email, String name, String phoneNumber, String address) {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(User.builder()
                        .email(email)
                        .password("OAUTH_PROTECTED")
                        .name(name)
                        .phoneNumber(phoneNumber)
                        .role(User.Role.USER)
                        .build()));
        
        user.updateProfile(name, phoneNumber, address);
    }
}