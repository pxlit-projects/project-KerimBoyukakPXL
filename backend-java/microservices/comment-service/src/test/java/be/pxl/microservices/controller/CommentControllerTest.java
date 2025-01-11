package be.pxl.microservices.controller;

import be.pxl.microservices.domain.Comment;
import be.pxl.microservices.domain.dto.request.CommentRequest;
import be.pxl.microservices.repository.CommentRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Testcontainers
@AutoConfigureMockMvc
class CommentControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private CommentRepository commentRepository;

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
        commentRepository.deleteAll();
    }


    @Test
    void getCommentsByPostId() throws Exception {
        Comment comment = Comment.builder()
                .postId(1L)
                .content("This is a comment")
                .commenter("Author")
                .build();
        commentRepository.save(comment);

        mockMvc.perform(get("/api/comments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].content").value("This is a comment"));
    }

    @Test
    void createComment() throws Exception {
        CommentRequest commentRequest = new CommentRequest(1L, "This is a comment", "Author");
        mockMvc.perform(post("/api/comments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isCreated());
    }

    @Test
    void updateComment() throws Exception {
        Comment comment = Comment.builder()
                .postId(1L)
                .content("This is a comment")
                .commenter("Author")
                .build();
        comment = commentRepository.save(comment);

        CommentRequest commentRequest = new CommentRequest(1L, "Author", "Updated comment");
        mockMvc.perform(put("/api/comments/" + comment.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/comments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].content").value("Updated comment"));
    }

    @Test
    void deleteComment() throws Exception {
        Comment comment = Comment.builder()
                .postId(1L)
                .content("This is a comment")
                .commenter("Author")
                .build();
        comment = commentRepository.save(comment);

        mockMvc.perform(delete("/api/comments/" + comment.getId()))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/comments/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isEmpty());
    }
}