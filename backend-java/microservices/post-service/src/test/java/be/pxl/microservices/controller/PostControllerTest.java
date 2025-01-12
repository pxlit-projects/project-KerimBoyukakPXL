package be.pxl.microservices.controller;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.State;
import be.pxl.microservices.domain.dto.request.PostRequest;
import be.pxl.microservices.repository.PostRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
class PostControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private PostRepository postRepository;

    @Container
    private static MySQLContainer sqlContainer = new MySQLContainer("mysql:5.7.37");

    @DynamicPropertySource
    static void registerProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", sqlContainer::getJdbcUrl);
        registry.add("spring.datasource.username", sqlContainer::getUsername);
        registry.add("spring.datasource.password", sqlContainer::getPassword);
    }

    @AfterEach
    public void clearDatabase() {
        postRepository.deleteAll();
    }

    @Test
    void createPost_withEditorRole_shouldReturnCreated() throws Exception {
        PostRequest postRequest = new PostRequest("Title", "Content", "Author");
        mockMvc.perform(post("/api/posts")
                        .header("role", "editor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isCreated());
    }

    @Test
    void createPost_withNonEditorRole_shouldReturnUnauthorized() throws Exception {
        PostRequest postRequest = new PostRequest("Title", "Content", "Author");
        mockMvc.perform(post("/api/posts")
                        .header("role", "user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void saveConcept_withEditorRole_shouldReturnCreated() throws Exception {
        PostRequest postRequest = new PostRequest("Title", "Content", "Author");
        mockMvc.perform(post("/api/posts/concept")
                        .header("role", "editor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isCreated());
    }

    @Test
    void saveConcept_withNonEditorRole_shouldReturnUnauthorized() throws Exception {
        PostRequest postRequest = new PostRequest("Title", "Content", "Author");
        mockMvc.perform(post("/api/posts/concept")
                        .header("role", "user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getCreatedPosts_withEditorRole_shouldReturnOk() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.PENDING)
                .build();
        postRepository.save(post);

        mockMvc.perform(get("/api/posts")
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Title"));
    }

    @Test
    void getCreatedPosts_withNonEditorRole_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/posts")
                        .header("role", "user"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getConceptPosts_withEditorRole_shouldReturnOk() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.CONCEPT)
                .build();
        postRepository.save(post);

        mockMvc.perform(get("/api/posts/concept")
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Title"));
    }

    @Test
    void getConceptPosts_withNonEditorRole_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/posts/concept")
                        .header("role", "user"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getPublishedPosts_withEditorRole_shouldReturnOk() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.PUBLISHED)
                .build();
        postRepository.save(post);

        mockMvc.perform(get("/api/posts/published")
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Title"));
    }

    @Test
    void getPublishedPosts_withUserRole_shouldReturnOk() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.PUBLISHED)
                .build();
        postRepository.save(post);

        mockMvc.perform(get("/api/posts/published")
                        .header("role", "user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Title"));
    }

    @Test
    void getPublishedPosts_withNoRole_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/posts/published")
                        .header("role", "guest"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getRejectedPosts_withEditorRole_shouldReturnOk() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.REJECTED)
                .build();
        postRepository.save(post);

        mockMvc.perform(get("/api/posts/rejected")
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Title"));
    }

    @Test
    void getRejectedPosts_withNonEditorRole_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/posts/rejected")
                        .header("role", "user"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void getPostById_withEditorRole_shouldReturnOk() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.PENDING)
                .build();
        post = postRepository.save(post);

        mockMvc.perform(get("/api/posts/" + post.getId())
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Title"));
    }

    @Test
    void getPostById_withUserRole_shouldReturnOk() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.PENDING)
                .build();
        post = postRepository.save(post);

        mockMvc.perform(get("/api/posts/" + post.getId())
                        .header("role", "user"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Title"));
    }

    @Test
    void getPostById_withNoRole_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/api/posts/1")
                        .header("role", "guest"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updatePost_withEditorRole_shouldReturnOk() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.PENDING)
                .build();
        post = postRepository.save(post);

        PostRequest postRequest = new PostRequest("Updated Title", "Updated Content", "Author");
        mockMvc.perform(put("/api/posts/" + post.getId())
                        .header("role", "editor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/posts/" + post.getId())
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    void updatePost_withNonEditorRole_shouldReturnUnauthorized() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.PENDING)
                .build();
        post = postRepository.save(post);

        PostRequest postRequest = new PostRequest("Updated Title", "Updated Content", "Author");
        mockMvc.perform(put("/api/posts/" + post.getId())
                        .header("role", "user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void updateRejectedPost_withEditorRole_shouldReturnOk() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.REJECTED)
                .build();
        post = postRepository.save(post);

        PostRequest postRequest = new PostRequest("Updated Title", "Updated Content", "Author");
        mockMvc.perform(put("/api/posts/rejected/" + post.getId())
                        .header("role", "editor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/posts/" + post.getId())
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    void updateRejectedPost_withNonEditorRole_shouldReturnUnauthorized() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.REJECTED)
                .build();
        post = postRepository.save(post);

        PostRequest postRequest = new PostRequest("Updated Title", "Updated Content", "Author");
        mockMvc.perform(put("/api/posts/rejected/" + post.getId())
                        .header("role", "user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void finishConcept_withEditorRole_shouldReturnOk() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.CONCEPT)
                .build();
        post = postRepository.save(post);

        PostRequest postRequest = new PostRequest("Finished Title", "Finished Content", "Author");
        mockMvc.perform(put("/api/posts/concept/" + post.getId())
                        .header("role", "editor")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/posts/" + post.getId())
                        .header("role", "editor"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Finished Title"));
    }

    @Test
    void finishConcept_withNonEditorRole_shouldReturnUnauthorized() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.CONCEPT)
                .build();
        post = postRepository.save(post);

        PostRequest postRequest = new PostRequest("Finished Title", "Finished Content", "Author");
        mockMvc.perform(put("/api/posts/concept/" + post.getId())
                        .header("role", "user")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isUnauthorized());
    }
}