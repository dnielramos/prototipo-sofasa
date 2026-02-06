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
      <div class="p-5 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100/50 border-2 border-gray-200 flex justify-between items-center shadow-sm">
        <span class="text-sm font-bold text-gray-700">Brecha (Gap)</span>
        <span class="text-3xl font-bold tracking-tight" [ngClass]="{
          'text-emerald-600': gap <= 0,
          'text-yellow-600': gap > 0 && gap <= 10,
          'text-rose-600': gap > 10
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

      <div class="pt-4 border-t border-gray-200 flex justify-end gap-3">
        <button 
          type="submit" 
          [disabled]="isSaving || form.invalid"
          class="px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-sofasa-blue-500 to-sofasa-blue-600 text-white hover:from-sofasa-blue-600 hover:to-sofasa-blue-700 hover:shadow-blue-glow-lg transition-all duration-200 shadow-lg flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg">
          <svg *ngIf="isSaving" class="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <svg *ngIf="!isSaving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
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
