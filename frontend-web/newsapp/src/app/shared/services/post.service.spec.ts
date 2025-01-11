import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PostService } from './post.service';
import { environment } from '../../../environments/environment';
import { Post } from '../models/post.model';
import { FilterModel } from '../models/filter.model';

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService]
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch created posts', () => {
    const mockPosts: Post[] = [{ id: 1, title: 'Test Post', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'created' }];

    service.getCreatedPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/posts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch concept posts', () => {
    const mockPosts: Post[] = [{ id: 1, title: 'Test Post', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'concept' }];

    service.getConceptPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/posts/concept`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch published posts', () => {
    const mockPosts: Post[] = [{ id: 1, title: 'Test Post', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'published' }];

    service.getPublishedPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/posts/published`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch rejected posts', () => {
    const mockPosts: Post[] = [{ id: 1, title: 'Test Post', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'rejected' }];

    service.getRejectedPosts().subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/posts/rejected`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });

  it('should fetch a post by ID', () => {
    const mockPost: Post = { id: 1, title: 'Test Post', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'created' };
    const postId = 1;

    service.getPost(postId).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/posts/${postId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPost);
  });

  it('should create a post', () => {
    const mockPost: Post = { id: 1, title: 'Test Post', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'created' };

    service.createPost(mockPost).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/posts`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPost);
    req.flush(mockPost);
  });

  it('should save a concept post', () => {
    const mockPost: Post = { id: 1, title: 'Test Post', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'concept' };

    service.saveConcept(mockPost).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/posts/concept`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockPost);
    req.flush(mockPost);
  });

  it('should update a post', () => {
    const mockPost: Post = { id: 1, title: 'Updated Post', content: 'Updated Content', author: 'Test Author', dateCreated: new Date(), state: 'created' };
    const postId = 1;

    service.updatePost(postId, mockPost).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/posts/${postId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPost);
    req.flush(mockPost);
  });

  it('should update a concept post', () => {
    const mockPost: Post = { id: 1, title: 'Updated Post', content: 'Updated Content', author: 'Test Author', dateCreated: new Date(), state: 'concept' };
    const postId = 1;

    service.updateConcept(postId, mockPost).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/posts/concept/${postId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPost);
    req.flush(mockPost);
  });

  it('should update a rejected post', () => {
    const mockPost: Post = { id: 1, title: 'Updated Post', content: 'Updated Content', author: 'Test Author', dateCreated: new Date(), state: 'rejected' };
    const postId = 1;

    service.updateRejected(postId, mockPost).subscribe(post => {
      expect(post).toEqual(mockPost);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/posts/rejected/${postId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockPost);
    req.flush(mockPost);
  });

  it('should filter posts', () => {
    const mockPosts: Post[] = [
      { id: 1, title: 'Test Post', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'published' }
    ];
    const filter: FilterModel = { content: 'Test', author: 'Test Author', dateCreated: null };

    service.filterPosts(filter).subscribe(posts => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}post/api/posts/published`);
    expect(req.request.method).toBe('GET');
    req.flush(mockPosts);
  });
});
