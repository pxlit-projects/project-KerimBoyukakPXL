import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { confirmLeaveGuard } from './confirm-leave.guard';
import { AddPostComponent } from '../../core/posts/add-post/add-post.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';


describe('confirmLeaveGuard', () => {
  let component: AddPostComponent;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AddPostComponent, HttpClientTestingModule]
    }).compileComponents();

    const fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    route = {} as ActivatedRouteSnapshot;
    state = {} as RouterStateSnapshot;
  });

  it('should return true if postForm is not dirty', () => {
    component.postForm = { dirty: false } as any;
    const result = confirmLeaveGuard(component, route, state, state);
    expect(result).toBeTrue();
  });

  it('should return false if postForm is dirty and user cancels', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.postForm = { dirty: true } as any;
    const result = confirmLeaveGuard(component, route, state, state);
    expect(result).toBeFalse();
  });

  it('should return true if postForm is dirty and user confirms', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.postForm = { dirty: true } as any;
    const result = confirmLeaveGuard(component, route, state, state);
    expect(result).toBeTrue();
  });
});
