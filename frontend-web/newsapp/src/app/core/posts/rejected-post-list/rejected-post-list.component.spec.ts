import { TestBed } from '@angular/core/testing';
import { of} from 'rxjs';
import { PostService } from '../../../shared/services/post.service';
import { ReviewService } from '../../../shared/services/review.service';
import { AuthService } from '../../../shared/services/auth.service';
import { RejectedPostListComponent } from './rejected-post-list.component';
import { Post } from '../../../shared/models/post.model';
import { Review } from '../../../shared/models/review.model';

describe('RejectedPostListComponent', () => {
  let component: RejectedPostListComponent;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    mockPostService = jasmine.createSpyObj('PostService', ['getRejectedPosts']);
    mockReviewService = jasmine.createSpyObj('ReviewService', ['getReview']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);

    TestBed.configureTestingModule({
      imports: [RejectedPostListComponent],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: ReviewService, useValue: mockReviewService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
    const fixture = TestBed.createComponent(RejectedPostListComponent);
    component = fixture.componentInstance;
  });

  it('should fetch rejected posts on ngOnInit', () => {
    const mockPosts: Post[] = [{ id: 1, title: 'Test Title', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'rejected' }];
    mockPostService.getRejectedPosts.and.returnValue(of(mockPosts));
    spyOn(component, 'fetchReviews');

    component.ngOnInit();

    expect(mockPostService.getRejectedPosts).toHaveBeenCalled();
    expect(component.postList).toEqual(mockPosts);
    expect(component.fetchReviews).toHaveBeenCalledWith(mockPosts);
  });



  it('should fetch reviews for each post', () => {
    const mockPosts: Post[] = [{ id: 1, title: 'Test Title', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'rejected' }];
    const mockReview: Review = { id: 1, postId: '1', reviewer: 'Reviewer', rejectMessage: 'Review Message' };
    mockReviewService.getReview.and.returnValue(of(mockReview));

    component.fetchReviews(mockPosts);

    expect(mockReviewService.getReview).toHaveBeenCalledWith(1);
    expect(component.reviews[1]).toEqual(mockReview);
  });



  it('should fetch a review for a post', () => {
    const mockReview: Review = { id: 1, postId: '1', reviewer: 'Reviewer', rejectMessage: 'Review Message' };
    mockReviewService.getReview.and.returnValue(of(mockReview));

    component.fetchReview(1).subscribe(review => {
      expect(review).toEqual(mockReview);
    });

    expect(mockReviewService.getReview).toHaveBeenCalledWith(1);
  });

});
