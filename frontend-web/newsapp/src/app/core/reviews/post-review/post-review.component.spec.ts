import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { ReviewService } from '../../../shared/services/review.service';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { PostReviewComponent } from './post-review.component';
import { Post } from '../../../shared/models/post.model';

describe('PostReviewComponent', () => {
  let component: PostReviewComponent;
  let mockReviewService: jasmine.SpyObj<ReviewService>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockReviewService = jasmine.createSpyObj('ReviewService', ['approvePost', 'rejectPost']);
    mockPostService = jasmine.createSpyObj('PostService', ['getPost']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { params: { id: 1 } },
    });

     TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, PostReviewComponent],
      providers: [
        FormBuilder,
        { provide: ReviewService, useValue: mockReviewService },
        { provide: PostService, useValue: mockPostService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
     });
    const fixture = TestBed.createComponent(PostReviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set post on ngOnInit', () => {
    const mockPost: Post = { id: 1, title: 'Test Post', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'draft' };
    mockPostService.getPost.and.returnValue(of(mockPost));

    component.ngOnInit();

    expect(mockPostService.getPost).toHaveBeenCalledWith(1);
    expect(component.post).toEqual(mockPost);
  });

  it('should set action on setAction', () => {
    component.setAction('reject');
    expect(component['action']).toBe('reject');
  });

  it('should approve post on onSubmit when action is approve', () => {
    component.setAction('approve');
    mockReviewService.approvePost.and.returnValue(of({}));

    component.onSubmit();

    expect(mockReviewService.approvePost).toHaveBeenCalledWith(1, component.reviewer);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should reject post on onSubmit when action is reject', () => {
    component.setAction('reject');
    component.reviewForm.setValue({ rejectMessage: 'Test Reject Message' });
    mockReviewService.rejectPost.and.returnValue(of({}));

    component.onSubmit();

    expect(mockReviewService.rejectPost).toHaveBeenCalledWith(1, component.reviewer, 'Test Reject Message');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not submit if action is not set', () => {
    component['action'] = '' as any;

    component.onSubmit();

    expect(mockReviewService.approvePost).not.toHaveBeenCalled();
    expect(mockReviewService.rejectPost).not.toHaveBeenCalled();
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });
});
