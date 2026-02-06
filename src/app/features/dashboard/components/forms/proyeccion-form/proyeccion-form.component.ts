import { Component, effect, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInputComponent } from '../../../../../shared/components/ui-input/ui-input.component';
import { UiTextareaComponent } from '../../../../../shared/components/ui-textarea/ui-textarea.component';
import { DashboardStateService } from '../../../dashboard-state.service';
import { ProyeccionUsuarios } from '../../../../../core/models/domain.models';

@Component({
    selector: 'app-proyeccion-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiInputComponent, UiTextareaComponent],
    template: `
    <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
      
      <div class="grid grid-cols-2 gap-4">
        <app-ui-input 
          label="PERSONAL ACTIVO" 
          type="number" 
          formControlName="cantidadPersonalActivo"
          placeholder="0"
          [error]="form.get('cantidadPersonalActivo')?.touched && form.get('cantidadPersonalActivo')?.invalid ? 'Requerido' : ''">
        </app-ui-input>

        <app-ui-input 
          label="PERSONAL PROYECTADO" 
          type="number" 
          formControlName="cantidadPersonalProyectado"
          placeholder="0"
          [error]="form.get('cantidadPersonalProyectado')?.touched && form.get('cantidadPersonalProyectado')?.invalid ? 'Requerido' : ''">
        </app-ui-input>
      </div>

      <!-- Calculated Gap -->
      <div class="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700 flex justify-between items-center">
        <span class="text-sm text-zinc-400">Brecha (Gap)</span>
        <span class="text-2xl font-bold tracking-tight" [ngClass]="{
          'text-emerald-500': gap <= 0,
          'text-yellow-500': gap > 0 && gap <= 10,
          'text-rose-500': gap > 10
        }">{{ gap > 0 ? '+' : '' }}{{ gap }}</span>
      </div>

      <app-ui-textarea 
        label="OBSERVACIONES" 
        formControlName="observaciones"
        placeholder="Describe el plan de contratación..."
        [rows]="3"
        [showCounter]="true"
        [maxLength]="500">
      </app-ui-textarea>

      <div class="pt-4 border-t border-zinc-800 flex justify-end gap-3">
        <button 
          type="submit" 
          [disabled]="isSaving || form.invalid"
          class="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <i *ngIf="isSaving" class="ph ph-spinner animate-spin text-lg"></i>
          <i *ngIf="!isSaving" class="ph-bold ph-floppy-disk"></i>
          {{ isSaving ? 'Guardando...' : 'Guardar' }}
        </button>
      </div>
    </form>
  `
})
export class ProyeccionFormComponent {
    private fb = inject(FormBuilder);
    private state = inject(DashboardStateService);

    data = input.required<ProyeccionUsuarios>();

    form: FormGroup;
    isSaving = false;

    constructor() {
        this.form = this.fb.group({
            cantidadPersonalActivo: [0, [Validators.required, Validators.min(0)]],
            cantidadPersonalProyectado: [0, [Validators.required, Validators.min(0)]],
            observaciones: ['', [Validators.maxLength(500)]]
        });

        effect(() => {
            const d = this.data();
            if (d) {
                this.form.patchValue({
                    cantidadPersonalActivo: d.cantidadPersonalActivo,
                    cantidadPersonalProyectado: d.cantidadPersonalProyectado,
                    observaciones: d.observaciones
                }, { emitEvent: false });
            }
        });
    }

    get gap(): number {
        const proyectado = this.form.get('cantidadPersonalProyectado')?.value || 0;
        const activo = this.form.get('cantidadPersonalActivo')?.value || 0;
        return proyectado - activo;
    }

    save() {
        if (this.form.invalid) return;
        this.isSaving = true;

        setTimeout(() => {
            const updated: ProyeccionUsuarios = {
                ...this.data(),
                ...this.form.value
            };

            this.state.updateProyeccion(updated);
            this.isSaving = false;
        }, 600);
    }
}
