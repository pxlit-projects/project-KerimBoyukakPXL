import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CommentService } from './comment.service';
import { environment } from '../../../environments/environment';
import { Comment } from '../models/comment.model';
import { AuthService } from './auth.service';

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;
  let authService: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService, AuthService]
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch comments by post ID', () => {
    const mockComments: Comment[] = [{ id: 1, postId: 1, content: 'Test comment', commenter: 'testUser' }];
    const postId = 1;
    const role = 'user';
    spyOn(authService, 'getRole').and.returnValue(role);

    service.getCommentsByPostId(postId).subscribe(comments => {
      expect(comments).toEqual(mockComments);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}comment/api/comments/${postId}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('role')).toBe(role);
    req.flush(mockComments);
  });

  it('should create a comment', () => {
    const mockComment: Comment = { id: 1, postId: 1, content: 'Test comment', commenter: 'testUser' };
    const role = 'user';
    spyOn(authService, 'getRole').and.returnValue(role);

    service.createComment(mockComment).subscribe(comment => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}comment/api/comments`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockComment);
    expect(req.request.headers.get('role')).toBe(role);
    req.flush(mockComment);
  });

  it('should update a comment', () => {
    const mockComment: Comment = { id: 1, postId: 1, content: 'Updated comment', commenter: 'testUser' };
    const commentId = 1;
    const role = 'user';
    spyOn(authService, 'getRole').and.returnValue(role);

    service.updateComment(commentId, mockComment).subscribe(comment => {
      expect(comment).toEqual(mockComment);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}comment/api/comments/${commentId}`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockComment);
    expect(req.request.headers.get('role')).toBe(role);
    req.flush(mockComment);
  });

  it('should delete a comment', () => {
    const commentId = 1;
    const role = 'user';
    spyOn(authService, 'getRole').and.returnValue(role);

    service.deleteComment(commentId).subscribe(response => {
      expect(response).toBeNull();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}comment/api/comments/${commentId}`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('role')).toBe(role);
    req.flush(null);
  });
});
