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
      <label *ngIf="label()" class="block text-xs font-medium text-zinc-500 mb-1 group-focus-within:text-blue-500 transition-colors">
        {{ label() }}
      </label>
      <textarea
        [rows]="rows()"
        [placeholder]="placeholder()"
        [value]="value"
        (input)="onInput($event)"
        (blur)="onTouched()"
        [disabled]="disabled"
        class="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
        [class.border-red-500]="error()"
      ></textarea>
      
      <div class="flex justify-between items-center mt-1">
         <p class="text-xs text-red-500 h-4">{{ error() }}</p>
         <span *ngIf="showCounter()" class="text-[10px] text-zinc-600">
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
