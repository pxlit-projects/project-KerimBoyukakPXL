package be.pxl.microservices.domain;

import lombok.Data;

@Data
public class NotificationRequest {
    private String message;
    private Long postId;
    private String email;
    private String subject;
}
