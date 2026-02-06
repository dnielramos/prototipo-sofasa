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

      <div class="pt-4 border-t border-zinc-800 flex justify-end">
        <button 
          type="submit" 
          [disabled]="isSaving || form.invalid"
          class="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <i *ngIf="isSaving" class="ph ph-spinner animate-spin text-lg"></i>
          <i *ngIf="!isSaving" class="ph-bold ph-calendar-plus"></i>
          {{ isSaving ? 'Programando...' : 'Programar Capacitación' }}
        </button>
      </div>
    </form>

    <!-- Capacitaciones Programadas -->
    <div class="mt-6 space-y-3">
      <h3 class="text-sm font-medium text-zinc-400">Próximas Capacitaciones ({{ capacitaciones().length }})</h3>

      <div *ngFor="let cap of capacitaciones()" class="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="font-medium text-white">{{ cap.tema }}</h4>
            <p class="text-sm text-zinc-400 mt-1">{{ cap.lugar }}</p>
          </div>
          <span class="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">{{ cap.fecha }}</span>
        </div>
        <div class="text-xs text-zinc-500">
          <i class="ph ph-user mr-1"></i>{{ getUserName(cap.responsable) }}
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
