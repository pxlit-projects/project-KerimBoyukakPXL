import {Component, inject, OnInit} from '@angular/core';
import {PostItemComponent} from "../post-item/post-item.component";
import {PostService} from "../../../shared/services/post.service";
import {Post} from "../../../shared/models/post.model";

@Component({
  selector: 'app-published-post-list',
  standalone: true,
  imports: [
    PostItemComponent
  ],
  templateUrl: './published-post-list.component.html',
  styleUrl: './published-post-list.component.css'
})
export class PublishedPostListComponent implements OnInit {
  postService: PostService = inject(PostService);
  postList!: Post[]

  ngOnInit(): void {
    this.fetchData();
  }
  fetchData(): void {
    this.postService.getPublishedPosts().subscribe({
      next: posts => {
        this.postList = posts;
      }
    });
  }

}
