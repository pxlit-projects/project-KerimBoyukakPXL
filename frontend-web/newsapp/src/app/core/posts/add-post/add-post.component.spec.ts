import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { PostService } from '../../../shared/services/post.service';
import { ReactiveFormsModule } from '@angular/forms';
import { AddPostComponent } from './add-post.component';
import { of } from 'rxjs';
import { Post } from '../../../shared/models/post.model'; // Assuming you have a Post model

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let postService: jasmine.SpyObj<PostService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getUser']);
    const postServiceSpy = jasmine.createSpyObj('PostService', ['createPost', 'saveConcept']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddPostComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: PostService, useValue: postServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    postService = TestBed.inject(PostService) as jasmine.SpyObj<PostService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set action', () => {
    component.setAction('save');
    expect(component['action']).toBe('save');
  });

  it('should call createPost and navigate to dashboard on submit when action is add', () => {
    component.setAction('add');
    component.postForm.controls['title'].setValue('Test Title');
    component.postForm.controls['content'].setValue('Test Content');
    authService.getUser.and.returnValue('testUser');
    const mockPost: Post = {
      title: 'Test Title',
      content: 'Test Content',
      author: 'testUser',
      dateCreated: new Date(),
      state: 'draft'
    };
    postService.createPost.and.returnValue(of(mockPost));

    component.onSubmit();

    expect(postService.createPost).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Test Title',
      content: 'Test Content',
      author: 'testUser'
    }));
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should call saveConcept and navigate to dashboard on submit when action is save', () => {
    component.setAction('save');
    component.postForm.controls['title'].setValue('Test Title');
    component.postForm.controls['content'].setValue('Test Content');
    authService.getUser.and.returnValue('testUser');
    const mockPost: Post = {
      title: 'Test Title',
      content: 'Test Content',
      author: 'testUser',
      dateCreated: new Date(),
      state: 'draft'
    };
    postService.saveConcept.and.returnValue(of(mockPost));

    component.onSubmit();

    expect(postService.saveConcept).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Test Title',
      content: 'Test Content',
      author: 'testUser',
    }));
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should not call createPost or saveConcept if form is invalid', () => {
    component.setAction('add');
    component.postForm.controls['title'].setValue('');
    component.postForm.controls['content'].setValue('');

    component.onSubmit();

    expect(postService.createPost).not.toHaveBeenCalled();
    expect(postService.saveConcept).not.toHaveBeenCalled();
  });
});
