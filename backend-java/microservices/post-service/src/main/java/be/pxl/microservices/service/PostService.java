package be.pxl.microservices.service;

import be.pxl.microservices.client.NotificationClient;
import be.pxl.microservices.client.NotificationRequest;
import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.State;
import be.pxl.microservices.domain.dto.request.PostRequest;
import be.pxl.microservices.domain.dto.response.PostResponse;
import be.pxl.microservices.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private final NotificationClient notificationClient;


    private static final Logger log = LoggerFactory.getLogger(PostService.class);


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
        log.info("Saving new post as concept");
        Post post = postRequest.toPost();
        post.setState(State.CONCEPT);
        postRepository.save(post);
        log.info("Post with id {} saved as concept", post.getId());
    }

    @Override
    public void createPost(PostRequest postRequest) {
        log.info("Creating new post");
        Post post = postRequest.toPost();
        post.setState(State.PENDING);
        postRepository.save(post);
        log.info("Post with id {} created", post.getId());
    }

    @Override
    public void updatePost(Long id, PostRequest postRequest) {
        log.info("Updating post with id {}", id);
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));
        if (post.getState() != State.PENDING) {
            throw new IllegalArgumentException("Only posts with state PENDING can be updated");
        }
        post.setContent(postRequest.getContent());
        post.setTitle(postRequest.getTitle());
        postRepository.save(post);
        log.info("Post with id {} updated", id);
    }

    @Override
    public void updateRejectedPost(Long id, PostRequest postRequest) {
        log.info("Updating rejected post with id {}", id);
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));
        if (post.getState() != State.REJECTED) {
            throw new IllegalArgumentException("Only posts with state REJECTED can be updated");
        }
        post.setContent(postRequest.getContent());
        post.setTitle(postRequest.getTitle());
        post.setState(State.PENDING);
        postRepository.save(post);
        log.info("Rejected post with id {} updated and put into the PENDING state", id);

        log.info("Deleting review for post with id {} after feedback from the reject message is implemented", id);
        rabbitTemplate.convertAndSend("DeleteReviewQueue", id);
    }

    @Override
    public void finishConcept(Long id, PostRequest postRequest) {
        log.info("Finishing concept with id {}", id);
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
        log.info("Concept with id {} finished", id);
    }
    @Override
    public void deletePost(Long id) {
        log.info("Deleting post with id {}", id);
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));
        postRepository.delete(post);
        log.info("Post with id {} deleted", id);
    }

    @RabbitListener(queues = "ApproveQueue")
    public void approvePost(Long id){
        log.info("Approving post with id {}", id);
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));

        if (post.getState() != State.PENDING) {
            throw new IllegalArgumentException("Only posts with state PENDING can be reviewed");
        }

        post.setState(State.PUBLISHED);
        postRepository.save(post);
        log.info("Post with id {} approved", id);

        NotificationRequest notificationRequest = new NotificationRequest();
        notificationRequest.setMessage("Your post has been approved and is now published");
        notificationRequest.setPostId(id);
        notificationRequest.setEmail(post.getAuthorEmail());
        notificationRequest.setSubject("Post approved");
        notificationClient.sendNotification(notificationRequest);
    }

    @RabbitListener(queues = "RejectQueue")
    public void rejectPost(Long id){
        log.info("Rejecting post with id {}", id);
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));

        if (post.getState() != State.PENDING) {
            throw new IllegalArgumentException("Only posts with state PENDING can be reviewed");
        }

        post.setState(State.REJECTED);
        postRepository.save(post);
        log.info("Post with id {} rejected", id);

        NotificationRequest notificationRequest = new NotificationRequest();
        notificationRequest.setMessage("Your post has been rejected and needs to be updated");
        notificationRequest.setPostId(id);
        notificationRequest.setEmail(post.getAuthorEmail());
        notificationRequest.setSubject("Post approved");
        notificationClient.sendNotification(notificationRequest);
    }
}
