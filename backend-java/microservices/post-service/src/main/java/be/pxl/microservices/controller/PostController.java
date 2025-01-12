package be.pxl.microservices.controller;

import be.pxl.microservices.domain.dto.request.PostRequest;
import be.pxl.microservices.service.IPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final IPostService postService;

    @PostMapping
    public ResponseEntity<?> createPost(@RequestHeader("role") String role,
                                        @RequestBody PostRequest postRequest) {
        if (!role.equals("editor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        postService.createPost(postRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/concept")
    public ResponseEntity<?> saveConcept(@RequestHeader("role") String role,
                                         @RequestBody PostRequest postRequest) {
        if (!role.equals("editor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        postService.saveConcept(postRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping
    public ResponseEntity<?> getCreatedPosts(@RequestHeader("role") String role) {
        if (!role.equals("editor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        return ResponseEntity.ok(postService.getAllCreatedPosts());
    }

    @GetMapping("/concept")
    public ResponseEntity<?> getConceptPosts(@RequestHeader("role") String role) {
        if (!role.equals("editor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        return ResponseEntity.ok(postService.getAllConceptPosts());
    }

    @GetMapping("/published")
    public ResponseEntity<?> getPublishedPosts(@RequestHeader("role") String role) {
        if (!role.equals("editor") && !role.equals("user")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        return ResponseEntity.ok(postService.getAllPublishedPosts());
    }

    @GetMapping("/rejected")
    public ResponseEntity<?> getRejectedPosts(@RequestHeader("role") String role) {
        if (!role.equals("editor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        return ResponseEntity.ok(postService.getAllRejectedPosts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@RequestHeader("role") String role, @PathVariable Long id) {
        if (!role.equals("editor") && !role.equals("user")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        return ResponseEntity.ok(postService.getPostById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePost(@RequestHeader("role") String role, @PathVariable Long id, @RequestBody PostRequest postRequest) {
        if (!role.equals("editor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        postService.updatePost(id, postRequest);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping("/rejected/{id}")
    public ResponseEntity<?> updateRejectedPost(@RequestHeader("role") String role, @PathVariable Long id, @RequestBody PostRequest postRequest) {
        if (!role.equals("editor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        postService.updateRejectedPost(id, postRequest);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PutMapping("/concept/{id}")
    public ResponseEntity<?> finishConcept(@RequestHeader("role") String role, @PathVariable Long id, @RequestBody PostRequest postRequest) {
        if (!role.equals("editor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        postService.finishConcept(id, postRequest);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}