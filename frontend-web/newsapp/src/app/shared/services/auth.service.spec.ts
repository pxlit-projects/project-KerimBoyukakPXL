import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set and get user', () => {
    service.setUser('testUser', 'editor');
    expect(service.getUser()).toBe('testUser');
    expect(service.getRole()).toBe('editor');
  });

  it('should return null for user and role after logout', () => {
    service.setUser('testUser', 'editor');
    service.logout();
    expect(service.getUser()).toBeNull();
    expect(service.getRole()).toBeNull();
  });

  it('should return true if user is logged in', () => {
    service.setUser('testUser', 'editor');
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    expect(service.isLoggedIn()).toBeFalse();
  });

  it('should load user from localStorage', () => {
    localStorage.setItem('username', 'testUser');
    localStorage.setItem('role', 'editor');
    service.loadUser();
    expect(service.getUser()).toBe('testUser');
    expect(service.getRole()).toBe('editor');
  });
});
