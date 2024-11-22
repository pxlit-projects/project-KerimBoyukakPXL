import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private username: string | null = null;
  private role : 'editor' | 'user' | null = null;

  constructor() {}
  setUser(username: string, role: 'editor' | 'user') {
    this.username = username;
    this.role = role;
  }
  getUser() {
    return this.username;
  }
  getRole() {
    return this.role;
  }
  logout() {
    this.username = null;
    this.role = null;
  }
  isLoggedIn() {
    return this.username !== null;
  }
}
