package be.pxl.microservices.repository;

import be.pxl.microservices.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    Optional<Comment> findByPostId(Long postId);
    List<Comment> findAllByPostId(Long postId);
}