import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInputComponent } from '../../../../../shared/components/ui-input/ui-input.component';
import { UiSelectComponent } from '../../../../../shared/components/ui-select/ui-select.component';
import { UiTextareaComponent } from '../../../../../shared/components/ui-textarea/ui-textarea.component';
import { DashboardStateService } from '../../../dashboard-state.service';
import { Vacacion } from '../../../../../core/models/domain.models';
import { MOCK_DB } from '../../../../../core/db/mock-db';

@Component({
  selector: 'app-vacaciones-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiInputComponent, UiSelectComponent, UiTextareaComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
      
      <div class="p-5 bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl flex items-center gap-3 shadow-sm">
        <svg class="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
        </svg>
        <div>
          <h4 class="text-sm font-semibold text-purple-900">Gestión de Vacaciones</h4>
          <p class="text-xs text-purple-700">Registre los días acumulados o programados.</p>
        </div>
      </div>

      <app-ui-select 
        label="COLABORADOR" 
        formControlName="idUsuario"
        [error]="form.get('idUsuario')?.touched && form.get('idUsuario')?.invalid ? 'Requerido' : ''">
        <option value="">Seleccione...</option>
        <option *ngFor="let u of usuarios" [value]="u.id">{{ u.nombre }}</option>
      </app-ui-select>

      <app-ui-input 
        label="DÍAS ACUMULADOS" 
        type="number" 
        formControlName="diasAcumulados"
        placeholder="0"
        [error]="form.get('diasAcumulados')?.touched && form.get('diasAcumulados')?.invalid ? 'Requerido' : ''">
      </app-ui-input>

      <app-ui-textarea 
        label="OBSERVACIONES / PROGRAMACIÓN" 
        formControlName="observaciones"
        placeholder="Fechas tentativas, notas..."
        [rows]="3"
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
          {{ isSaving ? 'Guardando...' : 'Actualizar Vacaciones' }}
        </button>
      </div>
    </form>

    <!-- List View -->
    <div class="mt-6 space-y-3">
      <h3 class="text-sm font-bold uppercase tracking-wider text-gray-700">Registros ({{ vacaciones().length }})</h3>

      <div *ngFor="let item of vacaciones()" class="p-5 bg-white border-2 border-gray-200 rounded-xl flex justify-between items-center group hover:border-sofasa-blue-200 hover:shadow-md transition-all">
        <div>
          <h4 class="font-semibold text-gray-900">{{ getUserName(item.idUsuario) }}</h4>
          <p class="text-sm text-gray-600 mt-1">{{ item.observaciones || 'Sin observaciones' }}</p>
        </div>
        <div class="text-center px-4 py-2 bg-gradient-to-br from-purple-50 to-purple-100/30 rounded-lg border border-purple-200">
            <span class="text-2xl font-bold text-purple-900">{{ item.diasAcumulados }}</span>
            <p class="text-[10px] text-purple-700 uppercase tracking-wider font-bold">Días</p>
        </div>
      </div>
    </div>
  `
})
export class VacacionesFormComponent {
  private fb = inject(FormBuilder);
  private state = inject(DashboardStateService);

  form: FormGroup;
  isSaving = false;
  usuarios = MOCK_DB.usuarios;
  vacaciones = signal<Vacacion[]>(MOCK_DB.vacaciones);

  constructor() {
    this.form = this.fb.group({
      idUsuario: ['', Validators.required],
      diasAcumulados: ['', [Validators.required, Validators.min(0)]],
      observaciones: ['']
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
      const nuevo: Vacacion = {
        id: `vac-${Date.now()}`,
        idProyecto: 'p-1',
        mes: new Date().toISOString().slice(0, 7),
        ...this.form.value
      };

      this.state.addVacacion(nuevo);
      this.vacaciones.update(list => [...list, nuevo]);
      this.form.reset();
      this.isSaving = false;
    }, 600);
  }
}
