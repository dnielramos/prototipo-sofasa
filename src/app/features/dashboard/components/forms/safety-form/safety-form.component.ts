import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInputComponent } from '../../../../../shared/components/ui-input/ui-input.component';
import { UiSelectComponent } from '../../../../../shared/components/ui-select/ui-select.component';
import { UiTextareaComponent } from '../../../../../shared/components/ui-textarea/ui-textarea.component';
import { DashboardStateService } from '../../../dashboard-state.service';
import { AccidenteIncidente } from '../../../../../core/models/domain.models';
import { CAT_TIPOS_ACCIDENTE } from '../../../../../core/db/catalogs.db';

@Component({
    selector: 'app-safety-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiInputComponent, UiSelectComponent, UiTextareaComponent],
    template: `
    <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">

        <div class="grid grid-cols-2 gap-4">
            <!-- Tabla 3: Cat_Tipos_Accidente -->
            <app-ui-select label="TIPO EVENTO (CATÁLOGO)" formControlName="tipo"
                [error]="form.get('tipo')?.touched && form.get('tipo')?.invalid ? 'Requerido' : ''">
                <option value="">Seleccione...</option>
                <!-- Mapping: User sees Title Case, System stores UPPERCASE to match legacy/mock data if needed. 
                     Or just store Name. Let's store Name for now to match other forms. 
                     Wait, Mock uses 'ACCIDENTE'. Let's force UPPERCASE value for compatibility -->
                <option *ngFor="let cat of catalogos" [value]="cat.nombre.toUpperCase()">{{ cat.nombre }}</option>
            </app-ui-select>

            <app-ui-input label="CANTIDAD" type="number" formControlName="cantidad" placeholder="0"
                [error]="form.get('cantidad')?.touched && form.get('cantidad')?.invalid ? 'Mínimo 0' : ''">
            </app-ui-input>
        </div>

        <app-ui-textarea label="OBSERVACIONES / DETALLES" formControlName="observaciones"
            placeholder="Describa el evento..." [rows]="4" [showCounter]="true" [maxLength]="500"
            [error]="form.get('observaciones')?.touched && form.get('observaciones')?.invalid ? 'Máximo 500 caracteres' : ''">
        </app-ui-textarea>

        <div class="pt-4 border-t border-zinc-800 flex justify-end">
            <button type="submit" [disabled]="isSaving"
                class="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-wait">
                <i *ngIf="isSaving" class="ph ph-spinner animate-spin text-lg"></i>
                <i *ngIf="!isSaving" class="ph-bold ph-floppy-disk"></i>
                {{ isSaving ? 'Guardando...' : 'Guardar Cambios' }}
            </button>
        </div>
    </form>
    `
})
export class SafetyFormComponent {
    private fb = inject(FormBuilder);
    private state = inject(DashboardStateService);

    data = input.required<AccidenteIncidente>();

    // Catalog Table
    catalogos = CAT_TIPOS_ACCIDENTE;

    form: FormGroup;
    isSaving = false;

    constructor() {
        this.form = this.fb.group({
            cantidad: [0, [Validators.required, Validators.min(0)]],
            tipo: ['', Validators.required],
            observaciones: ['', [Validators.maxLength(500)]]
        });

        // Populate form when data changes
        effect(() => {
            const currentData = this.data();
            if (currentData) {
                this.form.patchValue({
                    cantidad: currentData.cantidad,
                    tipo: currentData.tipo,
                    observaciones: currentData.observaciones
                });
            }
        });
    }

    save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSaving = true;

        setTimeout(() => {
            const updated: AccidenteIncidente = {
                ...this.data(),
                ...this.form.value
            };

            this.state.updateSafety(updated);
            this.isSaving = false;
        }, 800);
    }
}
