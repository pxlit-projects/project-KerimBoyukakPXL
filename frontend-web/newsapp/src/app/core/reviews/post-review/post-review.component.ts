import {Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {ReviewService} from "../../../shared/services/review.service";
import {PostService} from "../../../shared/services/post.service";
import {Post} from "../../../shared/models/post.model";
import {AuthService} from "../../../shared/services/auth.service";

@Component({
  selector: 'app-post-review',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './post-review.component.html',
  styleUrl: './post-review.component.css'
})
export class PostReviewComponent implements OnInit {
  fb: FormBuilder = inject(FormBuilder);
  reviewService: ReviewService = inject(ReviewService);
  postService: PostService = inject(PostService);
  authService = inject(AuthService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);

  reviewer = this.authService.getUser();
  postId: number = this.route.snapshot.params['id'];
  post!: Post;
  reviewForm: FormGroup = this.fb.group({
    rejectMessage: ['']
  });
  private action: 'approve' | 'reject' = 'approve';

  ngOnInit(): void {
    this.postService.getPost(this.postId).subscribe(post => {
      this.post = post;
    });
  }

  setAction(action: 'approve' | 'reject') {
    this.action = action;
  }

  onSubmit() {
    if (this.action === 'approve') {
      this.reviewService.approvePost(this.postId, this.reviewer).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    } else if (this.action === 'reject') {
      const rejectMessage = this.reviewForm.get('rejectMessage')?.value;
      this.reviewService.rejectPost(this.postId,this.reviewer, rejectMessage).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}
