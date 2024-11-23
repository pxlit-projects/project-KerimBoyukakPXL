import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private username: string | null = null;
  private role : 'editor' | 'user' | null = null;

  constructor() {this.loadUser()}
  setUser(username: string, role: 'editor' | 'user') {
    this.username = username;
    this.role = role;
    localStorage.setItem('username', username);
    localStorage.setItem('role', role);
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
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  }
  isLoggedIn() {
    return localStorage.getItem('username') !== null;
  }
  loadUser() {
    this.username = localStorage.getItem('username');
    this.role = localStorage.getItem('role') as 'editor' | 'user';
  }
}
