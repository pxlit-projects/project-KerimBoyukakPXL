import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { DashboardComponent } from './dashboard.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {of} from "rxjs";

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockRoute: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUser', 'logout']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      snapshot: { params: { id: 1 } },
    });
     TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    });
    const fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selectedOption to "published" when selectOption is called with "published"', () => {
    component.selectOption('published');
    expect(component.selectedOption).toBe('published');
  });

  it('should set selectedOption to "created" when selectOption is called with "created"', () => {
    component.selectOption('created');
    expect(component.selectedOption).toBe('created');
  });

  it('should set selectedOption to "drafts" when selectOption is called with "drafts"', () => {
    component.selectOption('drafts');
    expect(component.selectedOption).toBe('drafts');
  });

  it('should set selectedOption to "rejected" when selectOption is called with "rejected"', () => {
    component.selectOption('rejected');
    expect(component.selectedOption).toBe('rejected');
  });

  it('should set username on ngOnInit', () => {
    mockAuthService.getUser.and.returnValue('testUser');
    component.ngOnInit();
    expect(component.username).toBe('testUser');
  });

  it('should call authService.logout and navigate to login on logout', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });
});
