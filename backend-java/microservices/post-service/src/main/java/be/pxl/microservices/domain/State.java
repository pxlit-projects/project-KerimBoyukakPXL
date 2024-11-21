package be.pxl.microservices.domain;

public enum State {
    CREATED,    // Waiting for approval
    CONCEPT,    // Draft
    PUBLISHED,  // Approved
    REJECTED    // Rejected
}
