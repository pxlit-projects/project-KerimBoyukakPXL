package be.pxl.microservices.service;

import be.pxl.microservices.domain.Comment;
import be.pxl.microservices.domain.dto.request.CommentRequest;
import be.pxl.microservices.domain.dto.response.CommentResponse;
import be.pxl.microservices.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {
    private final CommentRepository commentRepository;
    private static final Logger log = LoggerFactory.getLogger(CommentService.class);


    @Override
    public List<CommentResponse> getCommentsByPostId(Long postId) {
        return commentRepository.findAllByPostId(postId).stream()
                .map(CommentResponse::new)
                .toList();
    }
    @Override
    public void createComment(CommentRequest commentRequest) {
        log.info("Creating new comment");
        Comment comment = commentRequest.toComment();
        commentRepository.save(comment);
        log.info("Comment with id {} created", comment.getId());
    }

    @Override
    public void updateComment(Long id, CommentRequest commentRequest) {
        log.info("Updating comment with id {}", id);
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment with id " + id +  " not found"));
        comment.setContent(commentRequest.getContent());
        commentRepository.save(comment);
        log.info("Comment with id {} updated", id);
    }

    @Override
    public void deleteComment(Long id) {
        log.info("Deleting comment with id {}", id);
        Comment comment = commentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Comment with id " + id +  " not found"));
        commentRepository.delete(comment);
        log.info("Comment with id {} deleted", id);
    }
}
