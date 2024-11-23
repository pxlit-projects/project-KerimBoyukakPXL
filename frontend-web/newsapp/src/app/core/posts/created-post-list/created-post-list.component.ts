import {Component, inject, OnInit} from '@angular/core';
import {PostService} from "../../../shared/services/post.service";
import {Post} from "../../../shared/models/post.model";
import {PostItemComponent} from "../post-item/post-item.component";

@Component({
  selector: 'app-created-post-list',
  standalone: true,
  imports: [
    PostItemComponent
  ],
  templateUrl: './created-post-list.component.html',
  styleUrl: './created-post-list.component.css'
})
export class CreatedPostListComponent implements OnInit {
  postService: PostService = inject(PostService);
  postList!: Post[]

  ngOnInit(): void {
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
