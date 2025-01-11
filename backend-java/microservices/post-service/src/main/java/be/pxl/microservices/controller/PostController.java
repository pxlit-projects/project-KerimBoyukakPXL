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
    @ResponseStatus(HttpStatus.CREATED)
    public void createPost(@RequestBody PostRequest postRequest) {
        postService.createPost(postRequest);
    }
    @PostMapping("/concept")
    @ResponseStatus(HttpStatus.CREATED)
    public void saveConcept(@RequestBody PostRequest postRequest) {
        postService.saveConcept(postRequest);
    }

    @GetMapping
    public ResponseEntity<?> getCreatedPosts() {
        return ResponseEntity.ok(postService.getAllCreatedPosts());
    }
    @GetMapping("/concept")
    public ResponseEntity<?> getConceptPosts() {
        return ResponseEntity.ok(postService.getAllConceptPosts());
    }
    @GetMapping("/published")
    public ResponseEntity<?> getPublishedPosts() {
        return ResponseEntity.ok(postService.getAllPublishedPosts());
    }
    @GetMapping("/rejected")
    public ResponseEntity<?> getRejectedPosts() {
        return ResponseEntity.ok(postService.getAllRejectedPosts());
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(postService.getPostById(id));
    }
    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updatePost(@PathVariable Long id, @RequestBody PostRequest postRequest) {
        postService.updatePost(id, postRequest);
    }

    @PutMapping("/rejected/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void updateRejectedPost(@PathVariable Long id, @RequestBody PostRequest postRequest) {
        postService.updateRejectedPost(id, postRequest);
    }

    @PutMapping("/concept/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void finishConcept(@PathVariable Long id, @RequestBody PostRequest postRequest) {
        postService.finishConcept(id, postRequest);
    }
}
