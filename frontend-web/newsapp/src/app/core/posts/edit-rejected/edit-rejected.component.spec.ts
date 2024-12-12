import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditRejectedComponent } from './edit-rejected.component';

describe('EditRejectedComponent', () => {
  let component: EditRejectedComponent;
  let fixture: ComponentFixture<EditRejectedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditRejectedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
