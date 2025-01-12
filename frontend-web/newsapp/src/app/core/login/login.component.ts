import {Component, inject} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  username: string = '';
  role: 'user' | 'editor' = 'user';

  onSubmit() {
    if (this.username) {
      this.authService.setUser(this.username, this.role);
      if (this.authService.getRole() === 'editor') {
        this.router.navigate(['/dashboard']);
      } else if (this.authService.getRole() === 'user') {
        this.router.navigate(['/user-dashboard']);
      }
    }
  }
}
