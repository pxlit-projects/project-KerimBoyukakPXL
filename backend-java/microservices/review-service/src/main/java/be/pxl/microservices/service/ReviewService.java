package be.pxl.microservices.service;

import be.pxl.microservices.domain.Review;
import be.pxl.microservices.domain.dto.request.ReviewRequest;
import be.pxl.microservices.domain.dto.response.ReviewResponse;
import be.pxl.microservices.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private final ReviewRepository reviewRepository;
    private final RabbitTemplate rabbitTemplate;

    public ReviewResponse getReviewByPostId(Long id) {
        return reviewRepository.findByPostId(id)
                .map(ReviewResponse::new)
                .orElseThrow(() -> new IllegalArgumentException("Review with id " + id + " not found"));
    }

    public void approvePost(Long id) {
        rabbitTemplate.convertAndSend("ApproveQueue", id);
    }

    public void rejectPost(Long id, ReviewRequest reviewRequest) {
        Review review = reviewRequest.toReview();
        rabbitTemplate.convertAndSend("RejectQueue", id);
        reviewRepository.save(review);
    }
}
