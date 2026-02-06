import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInputComponent } from '../../../../../shared/components/ui-input/ui-input.component';
import { UiSelectComponent } from '../../../../../shared/components/ui-select/ui-select.component';
import { DashboardStateService } from '../../../dashboard-state.service';
import { Capacitacion } from '../../../../../core/models/domain.models';
import { MOCK_DB } from '../../../../../core/db/mock-db';

@Component({
  selector: 'app-capacitaciones-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiInputComponent, UiSelectComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
      
      <div class="grid grid-cols-2 gap-4">
        <app-ui-input 
          label="TEMA" 
          type="text" 
          formControlName="tema"
          placeholder="Ej: Seguridad Industrial"
          [error]="form.get('tema')?.touched && form.get('tema')?.invalid ? 'Requerido' : ''">
        </app-ui-input>

        <app-ui-input 
          label="FECHA" 
          type="date" 
          formControlName="fecha"
          [error]="form.get('fecha')?.touched && form.get('fecha')?.invalid ? 'Requerido' : ''">
        </app-ui-input>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <app-ui-select 
          label="RESPONSABLE" 
          formControlName="responsable"
          [error]="form.get('responsable')?.touched && form.get('responsable')?.invalid ? 'Requerido' : ''">
          <option value="">Seleccione...</option>
          <option *ngFor="let u of usuarios" [value]="u.id">{{ u.nombre }}</option>
        </app-ui-select>

        <app-ui-input 
          label="LUGAR" 
          type="text" 
          formControlName="lugar"
          placeholder="Ej: Sala de Conferencias"
          [error]="form.get('lugar')?.touched && form.get('lugar')?.invalid ? 'Requerido' : ''">
        </app-ui-input>
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
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          {{ isSaving ? 'Programando...' : 'Programar Capacitación' }}
        </button>
      </div>
    </form>

    <!-- Capacitaciones Programadas -->
    <div class="mt-6 space-y-3">
      <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700">Próximas Capacitaciones ({{ capacitaciones().length }})</h3>

      <div *ngFor="let cap of capacitaciones()" class="p-5 bg-white border-2 border-gray-200 rounded-xl hover:border-sofasa-blue-200 hover:shadow-md transition-all">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="font-semibold text-gray-900">{{ cap.tema }}</h4>
            <p class="text-sm text-gray-600 mt-1">{{ cap.lugar }}</p>
          </div>
          <span class="px-3 py-1.5 bg-gradient-to-r from-sofasa-blue-50 to-sofasa-blue-100 text-sofasa-blue-700 text-xs font-semibold rounded-lg border border-sofasa-blue-200">{{ cap.fecha }}</span>
        </div>
        <div class="text-sm text-gray-600 flex items-center gap-1">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {{ getUserName(cap.responsable) }}
        </div>
      </div>
    </div>
  `
})
export class CapacitacionesFormComponent {
  private fb = inject(FormBuilder);
  private state = inject(DashboardStateService);

  form: FormGroup;
  isSaving = false;
  usuarios = MOCK_DB.usuarios;
  capacitaciones = signal<Capacitacion[]>(MOCK_DB.capacitaciones);

  constructor() {
    this.form = this.fb.group({
      tema: ['', Validators.required],
      fecha: ['', Validators.required],
      responsable: ['', Validators.required],
      lugar: ['', Validators.required]
    });
  }

  getUserName(userId: string): string {
    return this.usuarios.find(u => u.id === userId)?.nombre || 'Desconocido';
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    setTimeout(() => {
      const nueva: Capacitacion = {
        id: `cap-${Date.now()}`,
        idProyecto: 'p-1',
        ...this.form.value
      };

      this.state.addCapacitacion(nueva);
      this.capacitaciones.update(list => [...list, nueva]);
      this.form.reset();
      this.isSaving = false;
    }, 600);
  }
}
