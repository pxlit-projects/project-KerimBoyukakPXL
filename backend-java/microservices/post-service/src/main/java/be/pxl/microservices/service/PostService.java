package be.pxl.microservices.service;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.State;
import be.pxl.microservices.domain.dto.request.PostRequest;
import be.pxl.microservices.domain.dto.response.PostResponse;
import be.pxl.microservices.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {
    private final PostRepository postRepository;
    private final RabbitTemplate rabbitTemplate;


    public List<PostResponse> getAllConceptPosts() {
        return postRepository.findByState(State.CONCEPT).stream()
                .map(PostResponse::new)
                .toList();
    }
    public List<PostResponse> getAllCreatedPosts() {
        return postRepository.findByState(State.PENDING).stream()
                .map(PostResponse::new)
                .toList();
    }
    public List<PostResponse> getAllPublishedPosts() {
        return postRepository.findByState(State.PUBLISHED).stream()
                .map(PostResponse::new)
                .toList();
    }
    public List<PostResponse> getAllRejectedPosts() {
        return postRepository.findByState(State.REJECTED).stream()
                .map(PostResponse::new)
                .toList();
    }

    public PostResponse getPostById(Long id) {
        return postRepository.findById(id)
                .map(PostResponse::new)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));
    }

    @Override
    public void saveConcept(PostRequest postRequest) {
        Post post = postRequest.toPost();
        post.setState(State.CONCEPT);
        postRepository.save(post);
    }

    @Override
    public void createPost(PostRequest postRequest) {
        Post post = postRequest.toPost();
        post.setState(State.PENDING);
        postRepository.save(post);
    }

    @Override
    public void updatePost(Long id, PostRequest postRequest) {    // These are the posts waiting to be published (state CREATED)
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));
        if (post.getState() != State.PENDING) {
            throw new IllegalArgumentException("Only posts with state PENDING can be updated");
        }
        post.setContent(postRequest.getContent());
        post.setTitle(postRequest.getTitle());
        postRepository.save(post);
    }

    @Override
    public void finishConcept(Long id, PostRequest postRequest) {   // These are drafts (state CONCEPT)
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));
        if (post.getState() != State.CONCEPT) {
            throw new IllegalArgumentException("Post with id " + id + " is not in CONCEPT state");
        }
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setDateCreated(LocalDateTime.now());   // Update the dateCreated to the current date
        post.setState(State.PENDING);               // Whenever we finish a temporary concept, we change the state to PENDING when we are done
        postRepository.save(post);
    }
    @Override
    public void deletePost(Long id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));
        postRepository.delete(post);
    }

    @RabbitListener(queues = "ApproveQueue")   // listens to the putReview queue
    public void approvePost(Long id){
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));

        if (post.getState() != State.PENDING) {
            throw new IllegalArgumentException("Only posts with state PENDING can be reviewed");
        }

        post.setState(State.PUBLISHED);

        postRepository.save(post);
    }

    @RabbitListener(queues = "RejectQueue")   // listens to the putReview queue
    public void rejectPost(Long id){
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));

        if (post.getState() != State.PENDING) {
            throw new IllegalArgumentException("Only posts with state PENDING can be reviewed");
        }

        post.setState(State.REJECTED);

        postRepository.save(post);
    }
}
