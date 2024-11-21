package be.pxl.microservices.domain.dto.request;

import be.pxl.microservices.domain.Post;
import be.pxl.microservices.domain.State;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostRequest {
    private Long id;
    private String title;
    private String content;
    private String author;

    public Post toPost() {
        return Post.builder()
                .title(this.title)
                .content(this.content)
                .author(this.author)
                .dateCreated(LocalDateTime.now())
                .build();
    }
}
