package be.pxl.microservices.service;

import be.pxl.microservices.domain.dto.request.ReviewRequest;
import be.pxl.microservices.domain.dto.response.ReviewResponse;

public interface IReviewService {
    void approvePost(Long postId);
    ReviewResponse getReviewByPostId(Long id);


    void rejectPost(Long postId, ReviewRequest request);
}
