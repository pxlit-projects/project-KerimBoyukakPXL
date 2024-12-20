package be.pxl.microservices.domain;

import lombok.Data;

@Data
public class NotificationResponse {
    private String message;
    private Long postId;
}