import {Component, inject, OnInit} from '@angular/core';
import {PostService} from "../../../shared/services/post.service";
import {Post} from "../../../shared/models/post.model";
import {PostItemComponent} from "../post-item/post-item.component";

@Component({
  selector: 'app-concept-post-list',
  standalone: true,
  imports: [
    PostItemComponent
  ],
  templateUrl: './concept-post-list.component.html',
  styleUrl: './concept-post-list.component.css'
})
export class ConceptPostListComponent implements OnInit{
  postService: PostService = inject(PostService);
  conceptPostList!: Post[]
  ngOnInit(): void {
    this.fetchData();
  }
  fetchData(): void {
    this.postService.getConceptPosts().subscribe({
      next: posts => {
        this.conceptPostList = posts;
      }
    });
  }


}
