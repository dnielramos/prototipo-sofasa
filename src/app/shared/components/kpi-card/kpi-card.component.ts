import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export type KpiStatus = 'pending' | 'completed' | 'alert' | 'neutral' | 'success' | 'warning' | 'danger' | 'info';

@Component({
    selector: 'app-kpi-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './kpi-card.component.html',
    styleUrls: ['./kpi-card.component.css']
})
export class KpiCardComponent {
    title = input.required<string>();
    value = input.required<string | number>();
    subValue = input<string>('');
    status = input<KpiStatus>('neutral');
    icon = input.required<string>();
    clickable = input<boolean>(true);

    // Computed classes based on status - LIGHT THEME
    statusClasses = computed(() => {
        switch (this.status()) {
            case 'completed':
            case 'success':
                return 'bg-green-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]';
            case 'alert':
            case 'danger':
                return 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]';
            case 'pending':
            case 'warning':
                return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]';
            case 'info':
                return 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]';
            default:
                return 'bg-gray-400';
        }
    });

    bgClasses = computed(() => {
        const baseClasses = 'bg-white border-gray-200';
        if (!this.clickable()) {
            return baseClasses;
        }
        return baseClasses;
    });

    statusText = computed(() => {
        switch (this.status()) {
            case 'completed':
            case 'success':
                return 'Completado';
            case 'alert':
            case 'danger':
                return 'Alerta';
            case 'pending':
            case 'warning':
                return 'Pendiente';
            case 'info':
                return 'Info';
            default:
                return 'Neutral';
        }
    });
}
