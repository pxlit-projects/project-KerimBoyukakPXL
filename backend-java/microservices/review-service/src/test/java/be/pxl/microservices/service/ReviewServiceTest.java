package be.pxl.microservices.service;

import be.pxl.microservices.domain.Review;
import be.pxl.microservices.domain.dto.request.ReviewRequest;
import be.pxl.microservices.domain.dto.response.ReviewResponse;
import be.pxl.microservices.repository.ReviewRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
class ReviewServiceTest {
    @Mock
    private ReviewRepository reviewRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private ReviewService reviewService;

    @AfterEach
    public void clearDatabase() {
        reviewRepository.deleteAll();
    }
    @Test
    void getReviewByPostId() {
        Review review = new Review();
        when(reviewRepository.findByPostId(1L)).thenReturn(Optional.of(review));
        ReviewResponse reviewResponse = reviewService.getReviewByPostId(1L);
        assertNotNull(reviewResponse);
    }

    @Test
    void getReviewByPostId_NotFound() {
        when(reviewRepository.findByPostId(1L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> reviewService.getReviewByPostId(1L));
    }

    @Test
    void approvePost() {
        reviewService.approvePost(1L);
        verify(rabbitTemplate, times(1)).convertAndSend(eq("ApproveQueue"), eq(1L));
    }

    @Test
    void rejectPost() {
        ReviewRequest reviewRequest = new ReviewRequest(1L, "Reviewer", "Reason for rejection");
        reviewService.rejectPost(1L, reviewRequest);
        verify(rabbitTemplate, times(1)).convertAndSend(eq("RejectQueue"), eq(1L));
        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void deleteReview() {
        Review review = new Review();
        when(reviewRepository.findByPostId(1L)).thenReturn(Optional.of(review));
        reviewService.deleteReview(1L);
        verify(reviewRepository, times(1)).delete(review);
    }

    @Test
    void deleteReview_NotFound() {
        when(reviewRepository.findByPostId(1L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> reviewService.deleteReview(1L));
    }
}