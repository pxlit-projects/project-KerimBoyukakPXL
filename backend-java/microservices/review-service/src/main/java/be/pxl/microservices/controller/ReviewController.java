package be.pxl.microservices.controller;

import be.pxl.microservices.domain.dto.request.ReviewRequest;
import be.pxl.microservices.domain.dto.response.ReviewResponse;
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
    public ResponseEntity<?> getReviewByPostId(@PathVariable Long postId) {
        try{
            return ResponseEntity.ok(reviewService.getReviewByPostId(postId));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred: " + ex.getMessage());
        }
    }

    @PostMapping("/approve/{postId}")
    @ResponseStatus(HttpStatus.OK)
    public void approvePost(@PathVariable Long postId) {
        reviewService.approvePost(postId);
    }

    @PostMapping("/reject/{postId}")
    @ResponseStatus(HttpStatus.OK)
    public void rejectPost(@PathVariable Long postId, @RequestBody ReviewRequest request) {
        reviewService.rejectPost(postId, request);
    }
}
