import {Component, inject, OnInit} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";
import {CreatedPostListComponent} from "../posts/created-post-list/created-post-list.component";
import {ConceptPostListComponent} from "../posts/concept-post-list/concept-post-list.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    CreatedPostListComponent,
    ConceptPostListComponent,
    NgIf
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  username: string | null = '';
  selectedOption: string = 'created';

  selectOption(option: string): void {
    this.selectedOption = option;
  }

  ngOnInit(): void {
    this.username = this.authService.getUser();
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}