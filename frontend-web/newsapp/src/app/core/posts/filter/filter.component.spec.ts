import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { FilterComponent } from './filter.component';
import { FilterModel } from '../../../shared/models/filter.model';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, FilterComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit filterChanged event with lowercased filter values on valid form submit', () => {
    const mockForm = { valid: true };
    component.filter = { content: 'Test Content', author: 'Test Author', dateCreated: null };
    spyOn(component.filterChanged, 'emit');

    component.onSubmit(mockForm);

    expect(component.filter.content).toBe('test content');
    expect(component.filter.author).toBe('test author');
    expect(component.filterChanged.emit).toHaveBeenCalledWith({
      content: 'test content',
      author: 'test author',
      dateCreated: null
    });
  });

  it('should not emit filterChanged event on invalid form submit', () => {
    const mockForm = { valid: false };
    spyOn(component.filterChanged, 'emit');

    component.onSubmit(mockForm);

    expect(component.filterChanged.emit).not.toHaveBeenCalled();
  });
});
