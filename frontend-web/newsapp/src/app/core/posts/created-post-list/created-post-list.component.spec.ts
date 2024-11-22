import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatedPostListComponent } from './created-post-list.component';

describe('CreatedPostListComponent', () => {
  let component: CreatedPostListComponent;
  let fixture: ComponentFixture<CreatedPostListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatedPostListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatedPostListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
