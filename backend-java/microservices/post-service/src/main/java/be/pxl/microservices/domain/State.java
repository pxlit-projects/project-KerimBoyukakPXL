package be.pxl.microservices.domain;

public enum State {
    PENDING,    // Waiting for approval
    CONCEPT,    // Draft
    PUBLISHED,  // Approved
    REJECTED    // Rejected
}
