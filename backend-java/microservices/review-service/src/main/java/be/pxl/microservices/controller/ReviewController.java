package be.pxl.microservices.controller;

import be.pxl.microservices.domain.dto.request.ReviewRequest;
import be.pxl.microservices.service.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final IReviewService reviewService;

    @GetMapping("/{postId}")
    public ResponseEntity<?> getReviewByPostId(@RequestHeader("role") String role, @PathVariable Long postId) {
        if (!role.equals("editor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        return ResponseEntity.ok(reviewService.getReviewByPostId(postId));
    }

    @PostMapping("/approve/{postId}")
    public ResponseEntity<?> approvePost(@RequestHeader("role") String role, @PathVariable Long postId) {
        if (!role.equals("editor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        reviewService.approvePost(postId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    @PostMapping("/reject/{postId}")
    public ResponseEntity<?> rejectPost(@RequestHeader("role") String role, @PathVariable Long postId, @RequestBody ReviewRequest request) {
        if (!role.equals("editor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Access Denied");
        }
        reviewService.rejectPost(postId, request);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
}