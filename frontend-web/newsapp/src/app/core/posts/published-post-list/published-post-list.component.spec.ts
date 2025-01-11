import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PostService } from '../../../shared/services/post.service';
import { AuthService } from '../../../shared/services/auth.service';
import { PublishedPostListComponent } from './published-post-list.component';
import { Post } from '../../../shared/models/post.model';
import { FilterModel } from '../../../shared/models/filter.model';
import {RejectedPostListComponent} from "../rejected-post-list/rejected-post-list.component";

describe('PublishedPostListComponent', () => {
  let component: PublishedPostListComponent;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    mockPostService = jasmine.createSpyObj('PostService', ['getPublishedPosts', 'filterPosts']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getRole']);

    TestBed.configureTestingModule({
      imports: [PublishedPostListComponent],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    });
    const fixture = TestBed.createComponent(PublishedPostListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch published posts on ngOnInit', () => {
    const mockPosts: Post[] = [{ title: 'Test Title', content: 'Test Content', author: 'Test Author', dateCreated: new Date(), state: 'published' }];
    mockPostService.getPublishedPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(mockPostService.getPublishedPosts).toHaveBeenCalled();
    expect(component.postList).toEqual(mockPosts);
  });

  it('should fetch filtered posts on handleFilter', () => {
    const mockFilter: FilterModel = { content: 'test', author: 'author', dateCreated: null };
    const mockPosts: Post[] = [{ title: 'Filtered Title', content: 'Filtered Content', author: 'Filtered Author', dateCreated: new Date(), state: 'published' }];
    mockPostService.filterPosts.and.returnValue(of(mockPosts));

    component.handleFilter(mockFilter);

    expect(mockPostService.filterPosts).toHaveBeenCalledWith(mockFilter);
    expect(component.postList).toEqual(mockPosts);
  });
});
