import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {PostService} from "../../../shared/services/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {Post} from "../../../shared/models/post.model";

@Component({
  selector: 'app-edit-draft',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './edit-draft.component.html',
  styleUrl: './edit-draft.component.css'
})
export class EditDraftComponent implements OnInit {
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
      title: ['',Validators.required],
      content: ['',Validators.required]
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
      this.postService.updateConcept(this.id, updatedPost).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }

}
