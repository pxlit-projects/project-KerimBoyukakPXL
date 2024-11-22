import {Component, inject, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../shared/services/auth.service";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{
  router: Router = inject(Router);
  authService: AuthService = inject(AuthService);
  username: string | null = '';
  role: "editor" | "user" | null = 'user';

  ngOnInit(): void {
    this.username = this.authService.getUser();
    this.role = this.authService.getRole();
  }
}
