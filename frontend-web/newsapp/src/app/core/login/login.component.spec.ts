import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['setUser', 'getRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not call authService.setUser if form is invalid', () => {
    component.loginForm.controls['username'].setValue('');
    component.onSubmit();
    expect(authService.setUser).not.toHaveBeenCalled();
  });

  it('should call authService.setUser and navigate to dashboard if role is editor', () => {
    component.loginForm.controls['username'].setValue('testUser');
    component.loginForm.controls['role'].setValue('editor');
    authService.getRole.and.returnValue('editor');

    component.onSubmit();

    expect(authService.setUser).toHaveBeenCalledWith('testUser', 'editor');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should call authService.setUser and navigate to user-dashboard if role is user', () => {
    component.loginForm.controls['username'].setValue('testUser');
    component.loginForm.controls['role'].setValue('user');
    authService.getRole.and.returnValue('user');

    component.onSubmit();

    expect(authService.setUser).toHaveBeenCalledWith('testUser', 'user');
    expect(router.navigate).toHaveBeenCalledWith(['/user-dashboard']);
  });
});
