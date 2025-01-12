package be.pxl.microservices.controller;

import be.pxl.microservices.domain.dto.request.CommentRequest;
import be.pxl.microservices.service.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {
    private final ICommentService commentService;

    @GetMapping("/{postId}")
    public ResponseEntity<?> getCommentsByPostId(@RequestHeader("role") String role, @PathVariable Long postId) {
        if (!role.equals("user")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        return ResponseEntity.ok(commentService.getCommentsByPostId(postId));
    }

    @PostMapping
    public ResponseEntity<?> createComment(@RequestHeader("role") String role, @RequestBody CommentRequest commentRequest) {
        if (!role.equals("user")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        commentService.createComment(commentRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateComment(@RequestHeader("role") String role, @PathVariable Long id, @RequestBody CommentRequest commentRequest) {
        if (!role.equals("user")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        commentService.updateComment(id, commentRequest);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteComment(@RequestHeader("role") String role, @PathVariable Long id) {
        if (!role.equals("user")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        commentService.deleteComment(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}