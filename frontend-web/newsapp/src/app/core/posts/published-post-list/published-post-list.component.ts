import {Component, inject, OnInit} from '@angular/core';
import {PostItemComponent} from "../post-item/post-item.component";
import {PostService} from "../../../shared/services/post.service";
import {Post} from "../../../shared/models/post.model";
import {FilterComponent} from "../filter/filter.component";
import {FilterModel} from "../../../shared/models/filter.model";
import {AuthService} from "../../../shared/services/auth.service";
import {FormsModule} from "@angular/forms";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-published-post-list',
  standalone: true,
  imports: [
    PostItemComponent,
    FilterComponent,
    FormsModule,
    RouterLink
  ],
  templateUrl: './published-post-list.component.html',
  styleUrls: ['./published-post-list.component.css']
})
export class PublishedPostListComponent implements OnInit {
  postService: PostService = inject(PostService);
  authService: AuthService = inject(AuthService);
  postList!: Post[];
  role = this.authService.getRole();


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

  handleFilter(filter: FilterModel) {
    this.postService.filterPosts(filter).subscribe({
      next: posts => {
        this.postList = posts;
      }
    });
  }
}
