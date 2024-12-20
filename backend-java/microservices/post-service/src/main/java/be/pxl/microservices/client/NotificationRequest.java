package be.pxl.microservices.client;

import lombok.Data;

@Data
public class NotificationRequest {
    private String message;
    private Long postId;
    private String email;
    private String subject;
}
