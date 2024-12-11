package be.pxl.microservices.domain.dto.response;

import be.pxl.microservices.domain.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;
    private Long postId;
    private String reviewer;
    private String rejectMessage;

    public ReviewResponse(Review review) {
        this.id = review.getId();
        this.postId = review.getPostId();
        this.reviewer = review.getReviewer();
        this.rejectMessage = review.getRejectMessage();
    }
}
