import {Component, EventEmitter, Output} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {FilterModel} from "../../../shared/models/filter.model";


@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  filter: FilterModel = { content: '', author: '', dateCreated: null };

  @Output() filterChanged = new EventEmitter<FilterModel>();

  onSubmit(form: any) {
    if (form.valid) {
      this.filter.content = this.filter.content.toLowerCase();
      this.filter.author = this.filter.author.toLowerCase();
      this.filterChanged.emit(this.filter);
    }
  }
}
