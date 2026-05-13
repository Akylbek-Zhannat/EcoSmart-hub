package kz.ecosmart.controller;

import kz.ecosmart.model.User;
import kz.ecosmart.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email    = body.get("email");
        String password = body.get("password");

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty() || !userOpt.get().getPassword().equals(password)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
        }
        User u = userOpt.get();
        return ResponseEntity.ok(Map.of(
            "token",  "mock-jwt-" + u.getId() + "-" + System.currentTimeMillis(),
            "userId", u.getId(),
            "name",   u.getName(),
            "email",  u.getEmail(),
            "role",   u.getRole(),
            "avatar", u.getName().substring(0, 2).toUpperCase()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (userRepository.existsByEmail(email)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }
        User u = userRepository.save(User.builder()
            .name(body.get("name"))
            .email(email)
            .password(body.get("password"))
            .budget(25000.0).tariff(22.5).currency("₸")
            .build());
        return ResponseEntity.ok(Map.of(
            "token",  "mock-jwt-" + u.getId(),
            "userId", u.getId(),
            "name",   u.getName(),
            "email",  u.getEmail()
        ));
    }
}
