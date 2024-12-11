package be.pxl.microservices.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Post {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;

    private String content;

    private String author;

    @Temporal(TemporalType.TIMESTAMP)
    private LocalDateTime dateCreated;

    @Enumerated(EnumType.STRING)
    private State state;
}
