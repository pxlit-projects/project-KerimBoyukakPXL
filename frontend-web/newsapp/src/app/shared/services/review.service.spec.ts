import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ReviewService } from './review.service';
import { environment } from '../../../environments/environment';
import { Review } from '../models/review.model';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService]
    });
    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch a review', () => {
    const mockReview: Review = { postId: '1', reviewer: 'testReviewer', rejectMessage: 'testMessage' };
    const postId = 1;

    service.getReview(postId).subscribe(review => {
      expect(review).toEqual(mockReview);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}review/api/reviews/${postId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockReview);
  });

  it('should approve a post', () => {
    const postId = 1;
    const reviewer = 'testReviewer';

    service.approvePost(postId, reviewer).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}review/api/reviews/approve/${postId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ reviewer });
    req.flush({});
  });

  it('should reject a post', () => {
    const postId = 1;
    const reviewer = 'testReviewer';
    const rejectMessage = 'Not suitable';

    service.rejectPost(postId, reviewer, rejectMessage).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}review/api/reviews/reject/${postId}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ postId, reviewer, rejectMessage });
    req.flush({});
  });
});
