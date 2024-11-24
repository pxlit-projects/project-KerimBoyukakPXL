import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";
import {PublishedPostListComponent} from "../posts/published-post-list/published-post-list.component";

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [
    PublishedPostListComponent
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.css'
})
export class UserDashboardComponent implements OnInit{
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  username: string | null = '';

  ngOnInit(): void {
    this.username = this.authService.getUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
