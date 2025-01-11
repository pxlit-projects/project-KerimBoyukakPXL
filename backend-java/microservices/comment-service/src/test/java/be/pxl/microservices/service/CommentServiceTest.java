package be.pxl.microservices.service;

import be.pxl.microservices.domain.Comment;
import be.pxl.microservices.domain.dto.request.CommentRequest;
import be.pxl.microservices.domain.dto.response.CommentResponse;
import be.pxl.microservices.repository.CommentRepository;
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
import static org.mockito.Mockito.*;

@SpringBootTest
@AutoConfigureMockMvc
class CommentServiceTest {
    @Mock
    private CommentRepository commentRepository;

    @Mock
    private RabbitTemplate rabbitTemplate;

    @InjectMocks
    private CommentService commentService;

    @AfterEach
    public void clearDatabase() {
        commentRepository.deleteAll();
    }

    @Test
    void getCommentsByPostId() {
        Comment comment = new Comment();
        when(commentRepository.findAllByPostId(1L)).thenReturn(List.of(comment));
        List<CommentResponse> comments = commentService.getCommentsByPostId(1L);
        assertEquals(1, comments.size());
    }

    @Test
    void createComment() {
        CommentRequest commentRequest = new CommentRequest(1L, "Author", "This is a comment");
        commentService.createComment(commentRequest);
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void updateComment() {
        Comment comment = new Comment();
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        CommentRequest commentRequest = new CommentRequest(1L, "Author", "Updated comment");
        commentService.updateComment(1L, commentRequest);
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void updateComment_NotFound() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());
        CommentRequest commentRequest = new CommentRequest(1L, "Author", "Updated comment");
        assertThrows(IllegalArgumentException.class, () -> commentService.updateComment(1L, commentRequest));
    }

    @Test
    void deleteComment() {
        Comment comment = new Comment();
        when(commentRepository.findById(1L)).thenReturn(Optional.of(comment));
        commentService.deleteComment(1L);
        verify(commentRepository, times(1)).delete(comment);
    }

    @Test
    void deleteComment_NotFound() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());
        assertThrows(IllegalArgumentException.class, () -> commentService.deleteComment(1L));
    }
}