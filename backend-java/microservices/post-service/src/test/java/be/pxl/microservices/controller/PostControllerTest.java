package be.pxl.microservices.controller;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.State;
import be.pxl.microservices.domain.dto.request.PostRequest;
import be.pxl.microservices.repository.PostRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import org.springframework.http.MediaType;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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
    void createPost() throws Exception {
        PostRequest postRequest = new PostRequest("Title", "Content", "Author");
        mockMvc.perform(post("/api/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isCreated());
    }

    @Test
    void saveConcept() throws Exception {
        PostRequest postRequest = new PostRequest("Title", "Content", "Author");
        mockMvc.perform(post("/api/posts/concept")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isCreated());
    }

    @Test
    void getCreatedPosts() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.PENDING)
                .build();
        postRepository.save(post);

        mockMvc.perform(get("/api/posts"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Title"));
    }

    @Test
    void getConceptPosts() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.CONCEPT)
                .build();
        postRepository.save(post);

        mockMvc.perform(get("/api/posts/concept"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Title"));
    }

    @Test
    void getPublishedPosts() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.PUBLISHED)
                .build();
        postRepository.save(post);

        mockMvc.perform(get("/api/posts/published"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Title"));
    }

    @Test
    void getRejectedPosts() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.REJECTED)
                .build();
        postRepository.save(post);

        mockMvc.perform(get("/api/posts/rejected"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Title"));
    }

    @Test
    void getPostById() throws Exception {
        Post post = Post.builder()
                .title("Title")
                .content("Content")
                .author("Author")
                .authorEmail("author@example.com")
                .dateCreated(LocalDateTime.now())
                .state(State.PENDING)
                .build();
        post = postRepository.save(post);

        mockMvc.perform(get("/api/posts/" + post.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Title"));
    }

    @Test
    void updatePost() throws Exception {
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
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/posts/" + post.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    void updateRejectedPost() throws Exception {
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
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/posts/" + post.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    void finishConcept() throws Exception {
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
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/posts/" + post.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Finished Title"));
    }
}