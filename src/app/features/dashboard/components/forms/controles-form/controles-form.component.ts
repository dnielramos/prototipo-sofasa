import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInputComponent } from '../../../../../shared/components/ui-input/ui-input.component';
import { DashboardStateService } from '../../../dashboard-state.service';
import { CumplimientoControles } from '../../../../../core/models/domain.models';

@Component({
    selector: 'app-controles-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiInputComponent],
    template: `
    <form [formGroup]="form" (ngSubmit)="save()" class="space-y-6">
      
      <div class="grid grid-cols-2 gap-4">
         <app-ui-input 
            label="TOTAL PERSONAL" 
            type="number" 
            formControlName="totalPersonal"
            placeholder="0"
            [error]="form.get('totalPersonal')?.invalid && form.get('totalPersonal')?.touched ? 'Requerido' : ''">
         </app-ui-input>
    
         <app-ui-input 
            label="CUMPLIMIENTO" 
            type="number" 
            formControlName="totalCumplimiento"
            placeholder="0"
            [error]="form.get('totalCumplimiento')?.invalid && form.get('totalCumplimiento')?.touched ? 'Requerido' : ''">
         </app-ui-input>
      </div>
    
      <!-- Calculated Percentage -->
      <div class="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 flex justify-between items-center shadow-sm">
        <div>
            <span class="text-sm font-bold text-gray-700 block">Porcentaje Cumplimiento</span>
            <span class="text-xs text-gray-600 font-medium">Objetivo: 100%</span>
        </div>
        <span class="text-3xl font-bold tracking-tight" [ngClass]="{
            'text-emerald-600': calculatedPercentage >= 98,
            'text-yellow-600': calculatedPercentage >= 90 && calculatedPercentage < 98,
            'text-rose-600': calculatedPercentage < 90
        }">{{ calculatedPercentage.toFixed(2) }}%</span>
      </div>
    
      <div class="pt-4 border-t border-gray-200 flex justify-end gap-3">
          <button 
            type="submit" 
            [disabled]="isSaving || form.invalid"
            class="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-sofasa-blue-500 to-sofasa-blue-600 text-white hover:from-sofasa-blue-600 hover:to-sofasa-blue-700 hover:shadow-blue-glow-lg transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg">
            <svg *ngIf="isSaving" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <svg *ngIf="!isSaving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {{ isSaving ? 'Guardando...' : 'Guardar Reporte' }}
          </button>
      </div>
    </form>
  `
})
export class ControlesFormComponent {
    private fb = inject(FormBuilder);
    private state = inject(DashboardStateService);

    // We handle specific record update here. 
    // In a real scenario we might load the *existing* record for the month.
    // We'll mimic that by initializing with 0s or passed data.

    form: FormGroup;
    isSaving = false;

    constructor() {
        this.form = this.fb.group({
            totalPersonal: [342, [Validators.required, Validators.min(1)]],
            totalCumplimiento: [340, [Validators.required, Validators.min(0)]]
        });
    }

    get calculatedPercentage(): number {
        const total = this.form.get('totalPersonal')?.value || 0;
        const cumpl = this.form.get('totalCumplimiento')?.value || 0;
        if (total === 0) return 0;
        return (cumpl / total) * 100;
    }

    save() {
        if (this.form.invalid) return;
        this.isSaving = true;

        setTimeout(() => {
            const val = this.form.value;
            const pct = (val.totalCumplimiento / val.totalPersonal) * 100;

            const updated: CumplimientoControles = {
                id: `cc-${Date.now()}`,
                idProyecto: 'p-1',
                mes: new Date().toISOString().slice(0, 7),
                totalPersonal: val.totalPersonal,
                totalCumplimiento: val.totalCumplimiento,
                objetivo: 100,
                porcentajeCumplimiento: pct
            };

            this.state.updateControles(updated);
            this.isSaving = false;
        }, 600);
    }
}
