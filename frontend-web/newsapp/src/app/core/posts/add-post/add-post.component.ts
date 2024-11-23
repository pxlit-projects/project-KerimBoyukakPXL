import {Component, inject} from '@angular/core';
import {Router, RouterModule} from "@angular/router";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {AuthService} from "../../../shared/services/auth.service";
import {PostService} from "../../../shared/services/post.service";

@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './add-post.component.html',
  styleUrl: './add-post.component.css'
})
export class AddPostComponent {
  fb: FormBuilder = inject(FormBuilder);
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  postService: PostService = inject(PostService);

  private action: 'add' | 'save' = 'add';

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    content: ['', [Validators.required]],
  });

  setAction(action: 'add' | 'save') {
    this.action = action;
  }
  onSubmit() {
    if (this.postForm.valid) {
      const newPost = {
        ...this.postForm.value,
        author: this.authService.getUser(),
      };
      if (this.action === 'add') {
        this.postService.createPost(newPost).subscribe(post => {
          this.router.navigate(['/dashboard']);
        });
      } else if (this.action === 'save') {
        this.postService.saveConcept(newPost).subscribe(post => {
          this.router.navigate(['/dashboard']);
        });
      }
    }
  }
}
