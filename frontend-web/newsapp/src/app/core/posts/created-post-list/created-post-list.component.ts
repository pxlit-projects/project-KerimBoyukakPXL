import {Component, inject, OnInit} from '@angular/core';
import {PostService} from "../../../shared/services/post.service";
import {Post} from "../../../shared/models/post.model";
import {PostItemComponent} from "../post-item/post-item.component";
import {RouterLink} from "@angular/router";
import {AuthService} from "../../../shared/services/auth.service";
import {Review} from "../../../shared/models/review.model";

@Component({
  selector: 'app-created-post-list',
  standalone: true,
  imports: [
    PostItemComponent,
    RouterLink
  ],
  templateUrl: './created-post-list.component.html',
  styleUrl: './created-post-list.component.css'
})
export class CreatedPostListComponent implements OnInit {
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  postList!: Post[];
  username: string | null = null;


  ngOnInit(): void {
    this.username = this.authService.getUser();
    this.fetchData();
  }

  fetchData(): void {
    this.postService.getCreatedPosts().subscribe({
      next: posts => {
        this.postList = posts;
      }
    });
  }
}
