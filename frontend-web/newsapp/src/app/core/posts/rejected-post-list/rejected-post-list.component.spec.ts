import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectedPostListComponent } from './rejected-post-list.component';

describe('RejectedPostListComponent', () => {
  let component: RejectedPostListComponent;
  let fixture: ComponentFixture<RejectedPostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RejectedPostListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectedPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
