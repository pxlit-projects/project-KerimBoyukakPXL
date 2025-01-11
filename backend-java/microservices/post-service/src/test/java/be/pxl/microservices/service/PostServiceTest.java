package be.pxl.microservices.service;

import be.pxl.microservices.client.NotificationClient;
import be.pxl.microservices.client.NotificationRequest;
import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.State;
import be.pxl.microservices.domain.dto.request.PostRequest;
import be.pxl.microservices.domain.dto.response.PostResponse;
import be.pxl.microservices.repository.PostRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @Mock
    private NotificationClient notificationClient;

    @InjectMocks
    private PostService postService;

    @AfterEach
    public void clearDatabase() {
        postRepository.deleteAll();
    }

    @Test
    void getAllConceptPosts() {
        when(postRepository.findByState(State.CONCEPT)).thenReturn(List.of(new Post()));
        List<PostResponse> posts = postService.getAllConceptPosts();
        assertEquals(1, posts.size());
    }

    @Test
    void getAllCreatedPosts() {
        when(postRepository.findByState(State.PENDING)).thenReturn(List.of(new Post()));
        List<PostResponse> posts = postService.getAllCreatedPosts();
        assertEquals(1, posts.size());
    }

    @Test
    void getAllPublishedPosts() {
        when(postRepository.findByState(State.PUBLISHED)).thenReturn(List.of(new Post()));
        List<PostResponse> posts = postService.getAllPublishedPosts();
        assertEquals(1, posts.size());
    }

    @Test
    void getAllRejectedPosts() {
        when(postRepository.findByState(State.REJECTED)).thenReturn(List.of(new Post()));
        List<PostResponse> posts = postService.getAllRejectedPosts();
        assertEquals(1, posts.size());
    }

    @Test
    void getPostById() {
        Post post = new Post();
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        PostResponse postResponse = postService.getPostById(1L);
        assertNotNull(postResponse);
    }

    @Test
    void getPostById_NotFound() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> postService.getPostById(1L));
    }

    @Test
    void saveConcept() {
        PostRequest postRequest = new PostRequest();
        postService.saveConcept(postRequest);
        verify(postRepository, times(1)).save(any(Post.class));
    }

    @Test
    void createPost() {
        PostRequest postRequest = new PostRequest();
        postService.createPost(postRequest);
        verify(postRepository, times(1)).save(any(Post.class));
    }

    @Test
    void updatePost() {
        Post post = new Post();
        post.setState(State.PENDING);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        PostRequest postRequest = new PostRequest();
        postService.updatePost(1L, postRequest);
        verify(postRepository, times(1)).save(any(Post.class));
    }

    @Test
    void updatePost_NotFound() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());
        PostRequest postRequest = new PostRequest();
        assertThrows(IllegalArgumentException.class, () -> postService.updatePost(1L, postRequest));
    }

    @Test
    void updateRejectedPost() {
        Post post = new Post();
        post.setState(State.REJECTED);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        PostRequest postRequest = new PostRequest();
        postService.updateRejectedPost(1L, postRequest);
        verify(postRepository, times(1)).save(any(Post.class));
        verify(rabbitTemplate, times(1)).convertAndSend(eq("DeleteReviewQueue"), eq(1L));
    }

    @Test
    void finishConcept() {
        Post post = new Post();
        post.setState(State.CONCEPT);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        PostRequest postRequest = new PostRequest();
        postService.finishConcept(1L, postRequest);
        verify(postRepository, times(1)).save(any(Post.class));
    }

    @Test
    void approvePost() {
        Post post = new Post();
        post.setState(State.PENDING);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        postService.approvePost(1L);
        verify(postRepository, times(1)).save(any(Post.class));
        verify(notificationClient, times(1)).sendNotification(any(NotificationRequest.class));
    }

    @Test
    void rejectPost() {
        Post post = new Post();
        post.setState(State.PENDING);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        postService.rejectPost(1L);
        verify(postRepository, times(1)).save(any(Post.class));
        verify(notificationClient, times(1)).sendNotification(any(NotificationRequest.class));
    }

    @Test
    void rejectPost_NotPending() {
        Post post = new Post();
        post.setState(State.PUBLISHED);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        assertThrows(IllegalArgumentException.class, () -> postService.rejectPost(1L));
    }

    @Test
    void updateRejectedPost_NotRejected() {
        Post post = new Post();
        post.setState(State.PENDING);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        PostRequest postRequest = new PostRequest();
        assertThrows(IllegalArgumentException.class, () -> postService.updateRejectedPost(1L, postRequest));
    }

    @Test
    void finishConcept_NotConcept() {
        Post post = new Post();
        post.setState(State.PENDING);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        PostRequest postRequest = new PostRequest();
        assertThrows(IllegalArgumentException.class, () -> postService.finishConcept(1L, postRequest));
    }

    @Test
    void approvePost_NotPending() {
        Post post = new Post();
        post.setState(State.PUBLISHED);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        assertThrows(IllegalArgumentException.class, () -> postService.approvePost(1L));
    }
    @Test
    void updatePost_NotPending() {
        Post post = new Post();
        post.setState(State.PUBLISHED);
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        PostRequest postRequest = new PostRequest();
        assertThrows(IllegalArgumentException.class, () -> postService.updatePost(1L, postRequest));
    }
}