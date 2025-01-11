import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { PostService } from '../../../shared/services/post.service';
import { EditPostComponent } from './edit-post.component';
import { Post } from '../../../shared/models/post.model';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockPostService = jasmine.createSpyObj('PostService', ['getPost', 'updatePost']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { params: { id: 1 } },
    });
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, EditPostComponent],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    });


    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form and fetch post on ngOnInit', () => {
    const mockPost: Post = {
      title: 'Test Title',
      content: 'Test Content',
      author: 'Test Author',
      dateCreated: new Date(),
      state: 'draft'
    };
    mockPostService.getPost.and.returnValue(of(mockPost));

    component.ngOnInit();

    expect(component.editForm).toBeDefined();
    expect(component.editForm.get('author')?.value).toBe('Test Author');
    expect(component.editForm.get('title')?.value).toBe('Test Title');
    expect(component.editForm.get('createdAt')?.value).toBe(mockPost.dateCreated);
    expect(component.editForm.get('content')?.value).toBe('Test Content');
    expect(mockPostService.getPost).toHaveBeenCalledWith(1);
  });
});
