import {Component, inject, OnInit} from '@angular/core';
import {Post} from "../../../shared/models/post.model";
import {PostService} from "../../../shared/services/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent implements OnInit {
  postService : PostService = inject(PostService);
  router: Router = inject(Router);
  route: ActivatedRoute = inject(ActivatedRoute);
  fb: FormBuilder = inject(FormBuilder);
  id: number = this.route.snapshot.params['id'];

  post! : Observable<Post>;
  editForm!: FormGroup;

  ngOnInit(): void {
    this.editForm = this.fb.group({
      author: [{value: '', disabled: true}],
      createdAt: [{value: '', disabled: true}],
      title: [''],
      content: ['']
    });

    this.post = this.postService.getPost(this.id);
    this.post.subscribe(post => {
      this.editForm.patchValue({
        author: post.author,
        title: post.title,
        createdAt: post.dateCreated,
        content: post.content
      });
    });
  }
  onSubmit(): void {
    if (this.editForm.valid) {
      const updatedPost = {
        title: this.editForm.value.title,
        content: this.editForm.value.content,
        author: this.editForm.value.author,
      };
      this.postService.updatePost(this.id, updatedPost).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}