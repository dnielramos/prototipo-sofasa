import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ui-drawer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ui-drawer.component.html',
    styleUrls: ['./ui-drawer.component.css']
})
export class UiDrawerComponent {
    title = input<string>('');
    isOpen = input.required<boolean>();
    onClose = output<void>();

    close() {
        this.onClose.emit();
    }
}
