package be.pxl.microservices.domain.dto.request;

import be.pxl.microservices.domain.Review;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReviewRequest {
    private Long postId;
    private String reviewer;
    private String rejectMessage;

    public Review toReview() {
        return Review.builder()
                .postId(postId)
                .reviewer(reviewer)
                .rejectMessage(rejectMessage)
                .build();
    }
}
