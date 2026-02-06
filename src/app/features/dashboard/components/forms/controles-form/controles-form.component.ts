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
      <div class="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 flex justify-between items-center">
        <div>
            <span class="text-sm text-zinc-400 block">Porcentaje Cumplimiento</span>
            <span class="text-xs text-zinc-500">Objetivo: 100%</span>
        </div>
        <span class="text-3xl font-bold tracking-tight" [ngClass]="{
            'text-emerald-500': calculatedPercentage >= 98,
            'text-yellow-500': calculatedPercentage >= 90 && calculatedPercentage < 98,
            'text-rose-500': calculatedPercentage < 90
        }">{{ calculatedPercentage.toFixed(2) }}%</span>
      </div>
    
      <div class="pt-4 border-t border-zinc-800 flex justify-end">
          <button 
            type="submit" 
            [disabled]="isSaving || form.invalid"
            class="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <i *ngIf="isSaving" class="ph ph-spinner animate-spin text-lg"></i>
            <i *ngIf="!isSaving" class="ph-bold ph-shield-check"></i>
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
