import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormsModule} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";
import {PostService} from "../../../shared/services/post.service";
import {PostItemComponent} from "../post-item/post-item.component";
import {Post} from "../../../shared/models/post.model";
import {Comment} from "../../../shared/models/comment.model";
import {CommentService} from "../../../shared/services/comment.service";

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [
    PostItemComponent,
    FormsModule
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.css'
})
export class PostDetailComponent implements OnInit{
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);
  commentService: CommentService = inject(CommentService);

  postId = this.route.snapshot.params['id'];
  commenter = this.authService.getUser();
  post! : Post;
  comments!: Comment[];
  newCommentContent = '';
  editCommentContent = '';
  editingCommentId: number | null = null;
  ngOnInit(): void {
    this.fetchPost();
    this.fetchComments();
  }

  fetchPost(): void {
    this.postService.getPost(this.postId).subscribe({
      next: post => {
        this.post = post;
        this.fetchComments();
      },
    });
  }
  fetchComments(): void {
    this.commentService.getCommentsByPostId(this.postId).subscribe({
      next: comments => this.comments = comments,});
  }


  addComment(): void {
    const newComment = { postId: this.postId, commenter: this.commenter, content: this.newCommentContent };
    this.commentService.createComment(newComment).subscribe({
      next: () => {
        this.newCommentContent = '';
        this.fetchComments();
      },
      error: err => console.error('Error creating comment:', err)
    });
  }


  editComment(comment: Comment): void {
    this.editingCommentId = comment.id ?? null;
    this.editCommentContent = comment.content;
  }

  updateComment(): void {
    if (this.editingCommentId !== null && this.editingCommentId !== undefined) {
      const updatedComment = { content: this.editCommentContent };
      this.commentService.updateComment(this.editingCommentId, updatedComment).subscribe({
        next: comment => {
          this.editingCommentId = null;
          this.editCommentContent = '';
          this.fetchComments();
        }
      });
    }
  }

  deleteComment(id: number | undefined): void {
    this.commentService.deleteComment(id).subscribe({
      next: () => {
        this.comments = this.comments.filter(comment => comment.id !== id);
      }
    });
  }

  goBack() {
    this.router.navigate(['/user-dashboard']);
  }
}
