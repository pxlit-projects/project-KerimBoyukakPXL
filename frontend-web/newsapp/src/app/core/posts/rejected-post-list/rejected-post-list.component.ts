import {Component, inject, OnInit} from '@angular/core';
import {PostItemComponent} from "../post-item/post-item.component";
import {PostService} from "../../../shared/services/post.service";
import {Post} from "../../../shared/models/post.model";
import {Review} from "../../../shared/models/review.model";
import {ReviewService} from "../../../shared/services/review.service";
import {forkJoin, Observable} from "rxjs";
import {AsyncPipe, DatePipe, NgIf} from "@angular/common";

@Component({
  selector: 'app-rejected-post-list',
  standalone: true,
  imports: [
    PostItemComponent,
    NgIf,
    AsyncPipe,
    DatePipe
  ],
  templateUrl: './rejected-post-list.component.html',
  styleUrls: ['./rejected-post-list.component.css']
})
export class RejectedPostListComponent implements OnInit {
  postService: PostService = inject(PostService);
  reviewService: ReviewService = inject(ReviewService);

  reviews: { [postId: number]: Review } = {};
  postList!: Post[];

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
    this.postService.getRejectedPosts().subscribe({
      next: posts => {
        this.postList = posts;
        this.fetchReviews(posts);
      }
    });
  }

  fetchReviews(posts: Post[]): void {
    const reviewObservables = posts.map(post => this.fetchReview(post.id));
    forkJoin(reviewObservables).subscribe({
      next: reviews => {
        reviews.forEach((review, index) => {
          if (posts[index].id !== undefined) {
            this.reviews[posts[index].id!] = review;
          }
        });
      }
    });
  }

  fetchReview(postId: number | undefined): Observable<Review> {
    return this.reviewService.getReview(postId);
  }
}
