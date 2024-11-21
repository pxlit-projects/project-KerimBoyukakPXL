package be.pxl.microservices.repository;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.State;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    Optional<Post> findByAuthor(String author);
    List<Post> findByState(State state);
}
