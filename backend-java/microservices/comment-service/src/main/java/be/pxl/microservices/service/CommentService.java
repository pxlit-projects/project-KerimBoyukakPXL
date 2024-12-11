package be.pxl.microservices.service;

import be.pxl.microservices.domain.Comment;
import be.pxl.microservices.domain.dto.request.CommentRequest;
import be.pxl.microservices.domain.dto.response.CommentResponse;
import be.pxl.microservices.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {
    private final CommentRepository commentRepository;

    @Override
    public List<CommentResponse> getCommentsByPostId(Long postId) {
        return commentRepository.findAllByPostId(postId).stream()
                .map(CommentResponse::new)
                .toList();
    }
    @Override
    public void createComment(CommentRequest commentRequest) {
        Comment comment = commentRequest.toComment();
        commentRepository.save(comment);
    }

    @Override
    public void updateComment(Long id, CommentRequest commentRequest) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment with id " + id +  " not found"));
        comment.setContent(commentRequest.getContent());
        commentRepository.save(comment);
    }

    @Override
    public void deleteComment(Long id) {
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment with id " + id +  " not found"));
        commentRepository.delete(comment);
    }
}
