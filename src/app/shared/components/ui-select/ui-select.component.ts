import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ui-select',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => UiSelectComponent),
      multi: true
    }
  ],
  template: `
    <div class="group">
      <label *ngIf="label()" class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 group-focus-within:text-sofasa-blue-600 transition-colors">
        {{ label() }}
      </label>
      <div class="relative">
        <select
          [value]="value"
          (change)="onSelect($event)"
          (blur)="onTouched()"
          [disabled]="disabled"
          class="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 pr-10 text-sm text-gray-900 font-medium focus:outline-none focus:border-sofasa-blue-500 focus:ring-4 focus:ring-sofasa-blue-50 hover:border-gray-400 transition-all appearance-none shadow-sm focus:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
          [class.border-red-500]="error()"
          [class.focus:border-red-500]="error()"
          [class.focus:ring-red-50]="error()"
        >
          <option value="" disabled selected class="text-gray-400">{{ placeholder() }}</option>
          <ng-content></ng-content>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      <p *ngIf="error()" class="text-xs text-red-600 mt-1.5 font-medium">{{ error() }}</p>
    </div>
  `
})
export class UiSelectComponent implements ControlValueAccessor {
  label = input<string>('');
  placeholder = input<string>('Seleccione...');
  error = input<string>('');

  value: any = '';
  disabled = false;

  onChange: any = () => { };
  onTouched: any = () => { };

  onSelect(event: Event) {
    const val = (event.target as HTMLSelectElement).value;
    this.value = val;
    this.onChange(val);
  }

  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
