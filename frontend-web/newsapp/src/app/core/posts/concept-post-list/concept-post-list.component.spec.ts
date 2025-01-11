import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PostService } from '../../../shared/services/post.service';
import { ConceptPostListComponent } from './concept-post-list.component';
import { Post } from '../../../shared/models/post.model';
import {AuthService} from "../../../shared/services/auth.service";

describe('ConceptPostListComponent', () => {
  let component: ConceptPostListComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockPostService: jasmine.SpyObj<PostService>;

  beforeEach(async () => {
    mockPostService = jasmine.createSpyObj('PostService', ['getConceptPosts']);
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser']);


    TestBed.configureTestingModule({
      imports: [ConceptPostListComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: PostService, useValue: mockPostService }
      ]
    });

    const fixture = TestBed.createComponent(ConceptPostListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch concept posts on init', () => {
    const mockPosts: Post[] = [
      { title: 'Post 1', content: 'Content 1', author: 'Author 1', dateCreated: new Date(), state: 'draft' },
      { title: 'Post 2', content: 'Content 2', author: 'Author 2', dateCreated: new Date(), state: 'draft' }
    ];
    mockPostService.getConceptPosts.and.returnValue(of(mockPosts));

    component.ngOnInit();

    expect(component.conceptPostList).toEqual(mockPosts);
    expect(mockPostService.getConceptPosts).toHaveBeenCalled();
  });

  it('should set conceptPostList when fetchData is called', () => {
    const mockPosts: Post[] = [
      { title: 'Post 1', content: 'Content 1', author: 'Author 1', dateCreated: new Date(), state: 'draft' },
      { title: 'Post 2', content: 'Content 2', author: 'Author 2', dateCreated: new Date(), state: 'draft' }
    ];
    mockPostService.getConceptPosts.and.returnValue(of(mockPosts));

    component.fetchData();

    expect(component.conceptPostList).toEqual(mockPosts);
    expect(mockPostService.getConceptPosts).toHaveBeenCalled();
  });
});
