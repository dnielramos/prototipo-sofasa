import { Component, effect, inject, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInputComponent } from '../../../../../shared/components/ui-input/ui-input.component';
import { DashboardStateService } from '../../../dashboard-state.service';
import { RotacionPersonal } from '../../../../../core/models/domain.models';

@Component({
    selector: 'app-rotation-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiInputComponent],
    templateUrl: './rotation-form.component.html'
})
export class RotationFormComponent {
    private fb = inject(FormBuilder);
    private state = inject(DashboardStateService);

    data = input.required<RotacionPersonal>();

    form: FormGroup;
    isSaving = false;

    // Signal to calculate percentage in real-time for UI feedback
    currentPercentage = computed(() => {
        // We need to listen to form changes. Since form.valueChanges is observable, 
        // we can't easily use computed signal without toSignal, but for now we can just use a getter or simple logic in template.
        // However, to be "Signal" idiomatic, we might want to use signals for inputs if we were not using reactive forms.
        // For now, let's just rely on the form value in the save or simple template calculation if we bound it.
        // Actually, let's just use the form values in the template or a getter.
        return 0;
    });

    constructor() {
        this.form = this.fb.group({
            totalPersonal: [0, [Validators.required, Validators.min(1)]],
            totalRetiros: [0, [Validators.required, Validators.min(0)]]
        });

        effect(() => {
            const d = this.data();
            if (d) {
                this.form.patchValue({
                    totalPersonal: d.totalPersonal,
                    totalRetiros: d.totalRetiros
                }, { emitEvent: false });
            }
        });
    }

    get calculatedPercentage(): string {
        const total = this.form.get('totalPersonal')?.value || 0;
        const retiros = this.form.get('totalRetiros')?.value || 0;
        if (total === 0) return '0.0%';
        return ((retiros / total) * 100).toFixed(2) + '%';
    }

    save() {
        if (this.form.invalid) return;
        this.isSaving = true;

        setTimeout(() => {
            const rawCurrent = this.data();
            const formVal = this.form.value;
            const pct = (formVal.totalRetiros / formVal.totalPersonal) * 100;

            const updated: RotacionPersonal = {
                ...rawCurrent,
                totalPersonal: formVal.totalPersonal,
                totalRetiros: formVal.totalRetiros,
                porcentajeRotacion: pct
            };

            this.state.updateRotation(updated);
            this.isSaving = false;
        }, 600);
    }
}
