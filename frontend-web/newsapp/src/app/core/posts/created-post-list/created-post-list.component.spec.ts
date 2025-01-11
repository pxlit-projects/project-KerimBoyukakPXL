import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../../../shared/services/post.service';
import { CreatedPostListComponent } from './created-post-list.component';
import { Post } from '../../../shared/models/post.model';

describe('CreatedPostListComponent', () => {
  let component: CreatedPostListComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPostService: jasmine.SpyObj<PostService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);
    mockPostService = jasmine.createSpyObj('PostService', ['getCreatedPosts']);

     TestBed.configureTestingModule({
      imports: [CreatedPostListComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService }
      ]
     });
    const fixture = TestBed.createComponent(CreatedPostListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch created posts on init', () => {
    const mockPosts: Post[] = [
      { title: 'Post 1', content: 'Content 1', author: 'Author 1', dateCreated: new Date(), state: 'draft' },
      { title: 'Post 2', content: 'Content 2', author: 'Author 2', dateCreated: new Date(), state: 'draft' }
    ];
    mockPostService.getCreatedPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(component.postList).toEqual(mockPosts);
    expect(mockPostService.getCreatedPosts).toHaveBeenCalled();
  });

  it('should set postList when fetchData is called', () => {
    const mockPosts: Post[] = [
      { title: 'Post 1', content: 'Content 1', author: 'Author 1', dateCreated: new Date(), state: 'draft' },
      { title: 'Post 2', content: 'Content 2', author: 'Author 2', dateCreated: new Date(), state: 'draft' }
    ];
    mockPostService.getCreatedPosts.and.returnValue(of(mockPosts));

    component.fetchData();

    expect(component.postList).toEqual(mockPosts);
    expect(mockPostService.getCreatedPosts).toHaveBeenCalled();
  });
});
