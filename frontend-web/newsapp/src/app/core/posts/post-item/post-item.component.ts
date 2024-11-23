import {CommonModule, DatePipe} from "@angular/common";
import {Post} from "../../../shared/models/post.model";
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-post-item',
  standalone: true,
    imports:
      [
        DatePipe,
        CommonModule
      ],
  templateUrl: './post-item.component.html',
  styleUrl: './post-item.component.css'
})
export class PostItemComponent {
  @Input() post!: Post;
}
