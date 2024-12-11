package be.pxl.microservices.service;

import be.pxl.microservices.domain.dto.request.PostRequest;
import be.pxl.microservices.domain.dto.response.PostResponse;

import java.util.List;

public interface IPostService {
    List<PostResponse> getAllCreatedPosts();
    List<PostResponse> getAllConceptPosts();
    List<PostResponse> getAllPublishedPosts();
    List<PostResponse> getAllRejectedPosts();
    PostResponse getPostById(Long id);
    void createPost(PostRequest postRequest);
    void saveConcept(PostRequest postRequest);
    void updatePost(Long id, PostRequest postRequest);
    void finishConcept(Long id, PostRequest postRequest);
    void deletePost(Long id);
}
