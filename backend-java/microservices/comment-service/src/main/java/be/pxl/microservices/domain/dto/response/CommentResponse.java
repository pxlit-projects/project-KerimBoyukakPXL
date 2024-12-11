package be.pxl.microservices.domain.dto.response;

import be.pxl.microservices.domain.Comment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommentResponse {
    private Long id;
    private Long postId;
    private String commenter;
    private String content;

    public CommentResponse(Comment comment) {
        this.id = comment.getId();
        this.postId = comment.getPostId();
        this.commenter = comment.getCommenter();
        this.content = comment.getContent();
    }

}
