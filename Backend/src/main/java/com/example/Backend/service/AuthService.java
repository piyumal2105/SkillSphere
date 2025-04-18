package com.example.Backend.service;

import com.example.Backend.dto.LoginRequest;
import com.example.Backend.dto.RegisterRequest;
import com.example.Backend.model.User;
import com.example.Backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public String register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email).isPresent()) {
            return "Email already in use";
        }
        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPassword(request.password);
        userRepository.save(user);
        return "User registered successfully";
    }

    public String login(LoginRequest request) {
        Optional<User> user = userRepository.findByEmail(request.email);
        if (user.isPresent() && user.get().getPassword().equals(request.password)) {
            return "Login successful";
        }
        return "Invalid email or password";
    }
}