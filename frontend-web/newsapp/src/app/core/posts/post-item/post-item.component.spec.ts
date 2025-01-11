import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule, DatePipe } from '@angular/common';
import { PostItemComponent } from './post-item.component';
import { Post } from '../../../shared/models/post.model';
import { Component, Input } from '@angular/core';

describe('PostItemComponent', () => {
  let component: PostItemComponent;
  let fixture: ComponentFixture<PostItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, DatePipe, PostItemComponent],
      declarations: []
    })
      .compileComponents();

    fixture = TestBed.createComponent(PostItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display post data', () => {
    const mockPost: Post = {
      title: 'Test Title',
      content: 'Test Content',
      author: 'Test Author',
      dateCreated: new Date(),
      state: 'published'
    };
    component.post = mockPost;
    fixture.detectChanges();

    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.text-xl.font-bold.text-zinc-800')?.textContent).toContain('Test Title');
    expect(compiled.querySelector('.mt-3.text-zinc-800')?.textContent).toContain('Test Content');
    expect(compiled.querySelector('.mt-1.text-zinc-800.text-sm')?.textContent).toContain('Test Author');
    expect(compiled.querySelector('.mt-1.text-sm.text-gray-500')?.textContent).toContain(
      new DatePipe('en-US').transform(mockPost.dateCreated, 'dd/MM/yyyy')
    );
  });
});
