package be.pxl.microservices.service;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.State;
import be.pxl.microservices.domain.dto.request.PostRequest;
import be.pxl.microservices.domain.dto.response.PostResponse;
import be.pxl.microservices.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService {
    private final PostRepository postRepository;

    public List<PostResponse> getAllCreatedPosts() {
        return postRepository.findByState(State.CREATED).stream()
                .map(PostResponse::new)
                .toList();
    }
    public List<PostResponse> getAllConceptPosts() {
        return postRepository.findByState(State.CONCEPT).stream()
                .map(PostResponse::new)
                .toList();
    }
    public PostResponse getPostById(Long id) {
        return postRepository.findById(id)
                .map(PostResponse::new)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));
    }

    @Override
    public void addPost(PostRequest postRequest) {  // We can set the state to either CONCEPT or CREATED
        postRepository.save(postRequest.toPost());
    }

    @Override
    public void updatePostContent(Long id, String content) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));
        post.setContent(content);
        postRepository.save(post);
    }

    @Override
    public void finishConcept(Long id, PostRequest postRequest) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Post with id " + id + " not found"));
        if (post.getState() != State.CONCEPT) {
            throw new IllegalArgumentException("Post with id " + id + " is not in CONCEPT state");
        }
        post.setTitle(postRequest.getTitle());
        post.setContent(postRequest.getContent());
        post.setAuthor(postRequest.getAuthor());
        post.setDateCreated(LocalDateTime.now());   // Update the dateCreated to the current date
        post.setState(State.CREATED);   // Whenever we continue working on a concept, we change the state to CREATED when we are done
        postRepository.save(post);
    }
}
