package be.pxl.microservices.service;

import be.pxl.microservices.domain.Review;
import be.pxl.microservices.domain.dto.request.ReviewRequest;
import be.pxl.microservices.domain.dto.response.ReviewResponse;
import be.pxl.microservices.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService {
    private final ReviewRepository reviewRepository;
    private final RabbitTemplate rabbitTemplate;
    private static final Logger log = LoggerFactory.getLogger(ReviewService.class);


    public ReviewResponse getReviewByPostId(Long id) {
        return reviewRepository.findByPostId(id)
                .map(ReviewResponse::new)
                .orElseThrow(() -> new IllegalArgumentException("Review with id " + id + " not found"));
    }

    public void approvePost(Long id) {
        log.info("Approving post with id {}", id);
        rabbitTemplate.convertAndSend("ApproveQueue", id);
        log.info("Post with id {} approved", id);
    }

    public void rejectPost(Long id, ReviewRequest reviewRequest) {
        log.info("Rejecting post with id {}", id);
        Review review = reviewRequest.toReview();
        rabbitTemplate.convertAndSend("RejectQueue", id);
        reviewRepository.save(review);
        log.info("Post with id {} rejected", id);
    }

    @RabbitListener(queues = "DeleteReviewQueue")
    public void deleteReview(Long id) {
        log.info("Deleting review with id {}", id);
        Review review = reviewRepository.findByPostId(id)
                .orElseThrow(() -> new IllegalArgumentException("Review with id " + id + " not found"));
        reviewRepository.delete(review);
        log.info("Review with id {} deleted", id);
    }
}