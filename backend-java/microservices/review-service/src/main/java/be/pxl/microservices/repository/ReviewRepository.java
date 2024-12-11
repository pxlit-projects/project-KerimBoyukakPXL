package be.pxl.microservices.repository;

import be.pxl.microservices.domain.Review;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Optional<Review> findByPostId(Long postId);
}
