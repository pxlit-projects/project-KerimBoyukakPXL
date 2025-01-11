package be.pxl.microservices.domain.dto.request;

import be.pxl.microservices.domain.Review;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
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
