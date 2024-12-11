package be.pxl.microservices.service;

import be.pxl.microservices.domain.dto.request.CommentRequest;
import be.pxl.microservices.domain.dto.response.CommentResponse;

import java.util.List;

public interface ICommentService {
    List<CommentResponse> getCommentsByPostId(Long postId);
    void createComment(CommentRequest commentRequest);
    void updateComment(Long postId, CommentRequest commentRequest);
    void deleteComment(Long postId);
}
