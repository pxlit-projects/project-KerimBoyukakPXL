package be.pxl.microservices.configuration;

import org.springframework.amqp.core.Queue;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class QueueConfiguration {

    @Bean
    public Queue approveQueue() {
        return new Queue("ApproveQueue", false);
    }
    @Bean
    public Queue rejectQueue() {
        return new Queue("RejectQueue", false);
    }
    @Bean
    public Queue deleteReviewQueue() {
        return new Queue("DeleteReviewQueue", false);
    }
}