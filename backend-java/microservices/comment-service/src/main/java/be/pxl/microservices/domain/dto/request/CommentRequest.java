package be.pxl.microservices.domain.dto.request;

import be.pxl.microservices.domain.Comment;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CommentRequest {
    private Long postId;
    private String commenter;
    private String content;

    public Comment toComment() {
        return Comment.builder()
                .postId(postId)
                .commenter(commenter)
                .content(content)
                .build();
    }
}
