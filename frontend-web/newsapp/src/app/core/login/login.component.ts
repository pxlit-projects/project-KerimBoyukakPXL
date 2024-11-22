import {Component, inject} from '@angular/core';
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);

  username: string = '';
  role: 'editor' | 'user' = 'user';

  onSubmit() {
    if (!this.username) {
      alert('Please enter a username');
    }else{
      this.authService.setUser(this.username, this.role);
      this.router.navigate(['/dashboard']);
    }
  }
}
