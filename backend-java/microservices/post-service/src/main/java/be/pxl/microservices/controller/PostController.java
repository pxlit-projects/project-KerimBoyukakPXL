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
    public void addPost(@RequestBody PostRequest postRequest) {
        postService.addPost(postRequest);
    }

    @GetMapping
    public ResponseEntity<?> getCreatedPosts() {
        try{
            return ResponseEntity.ok(postService.getAllCreatedPosts());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + ex.getMessage());
        }
    }
    @GetMapping("/concept")
    public ResponseEntity<?> getConceptPosts() {
        try{
            return ResponseEntity.ok(postService.getAllConceptPosts());
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + ex.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getPostById(@PathVariable Long id) {
        try{
            return ResponseEntity.ok(postService.getPostById(id));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + ex.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updatePostContent(@PathVariable Long id, @RequestBody String content) {
        try{
            postService.updatePostContent(id, content);
            return ResponseEntity.ok("Post with id " + id + " updated successfully");
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + ex.getMessage());
        }
    }
}
