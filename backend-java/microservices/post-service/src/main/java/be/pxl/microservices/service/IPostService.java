package be.pxl.microservices.service;

import be.pxl.microservices.domain.dto.request.PostRequest;
import be.pxl.microservices.domain.dto.response.PostResponse;

import java.util.List;

public interface IPostService {
    List<PostResponse> getAllCreatedPosts();
    List<PostResponse> getAllConceptPosts();
    PostResponse getPostById(Long id);
    void addPost(PostRequest postRequest);
    void updatePostContent(Long id, String content);
    void finishConcept(Long id, PostRequest postRequest);
}
