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
      <label *ngIf="label()" class="block text-xs font-medium text-zinc-500 mb-1 group-focus-within:text-blue-500 transition-colors">
        {{ label() }}
      </label>
      <div class="relative">
        <select
          [value]="value"
          (change)="onSelect($event)"
          (blur)="onTouched()"
          [disabled]="disabled"
          class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
          [class.border-red-500]="error()"
        >
          <option value="" disabled selected>{{ placeholder() }}</option>
          <ng-content></ng-content>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-zinc-500">
           <i class="ph-bold ph-caret-down"></i>
        </div>
      </div>
      <p *ngIf="error()" class="text-xs text-red-500 mt-1">{{ error() }}</p>
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
