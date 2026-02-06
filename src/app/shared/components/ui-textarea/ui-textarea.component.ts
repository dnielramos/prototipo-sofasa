import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
    selector: 'app-ui-textarea',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => UiTextareaComponent),
            multi: true
        }
    ],
    template: `
    <div class="group">
      <label *ngIf="label()" class="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2 group-focus-within:text-sofasa-blue-600 transition-colors">
        {{ label() }}
      </label>
      <textarea
        [rows]="rows()"
        [placeholder]="placeholder()"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [disabled]="disabled"
        class="w-full bg-white border-2 border-gray-300 rounded-xl px-4 py-3 text-sm text-gray-900 font-medium placeholder-gray-400 focus:outline-none focus:border-sofasa-blue-500 focus:ring-4 focus:ring-sofasa-blue-50 hover:border-gray-400 transition-all resize-none shadow-sm focus:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-50"
        [class.border-red-500]="error()"
        [class.focus:border-red-500]="error()"
        [class.focus:ring-red-50]="error()"
      ></textarea>
      
      <div class="flex justify-between items-center mt-1.5">
         <p class="text-xs text-red-600 font-medium h-4">{{ error() }}</p>
         <span *ngIf="showCounter()" class="text-xs font-medium" [class.text-gray-500]="value?.length < maxLength()" [class.text-red-600]="value?.length >= maxLength()">
            {{ value?.length || 0 }} / {{ maxLength() }}
         </span>
      </div>
    </div>
  `
})
export class UiTextareaComponent implements ControlValueAccessor {
    label = input<string>('');
    placeholder = input<string>('');
    error = input<string>('');
    rows = input<number>(4);
    showCounter = input<boolean>(false);
    maxLength = input<number>(500);

    value: any = '';
    disabled = false;

    onChange: any = () => { };
    onTouched: any = () => { };

    onInput(event: Event) {
        const val = (event.target as HTMLTextAreaElement).value;
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
