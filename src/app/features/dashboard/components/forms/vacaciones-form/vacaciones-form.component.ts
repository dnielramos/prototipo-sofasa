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
      
      <div class="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg flex items-center gap-3">
        <i class="ph-fill ph-airplane-tilt text-2xl text-purple-400"></i>
        <div>
          <h4 class="text-sm font-medium text-purple-100">Gestión de Vacaciones</h4>
          <p class="text-xs text-purple-400">Registre los días acumulados o programados.</p>
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

      <div class="pt-4 border-t border-zinc-800 flex justify-end">
        <button 
          type="submit" 
          [disabled]="isSaving || form.invalid"
          class="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <i *ngIf="isSaving" class="ph ph-spinner animate-spin text-lg"></i>
          <i *ngIf="!isSaving" class="ph-bold ph-floppy-disk"></i>
          {{ isSaving ? 'Guardando...' : 'Actualizar Vacaciones' }}
        </button>
      </div>
    </form>

    <!-- List View -->
    <div class="mt-6 space-y-3">
      <h3 class="text-sm font-medium text-zinc-400">Registros ({{ vacaciones().length }})</h3>

      <div *ngFor="let item of vacaciones()" class="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg flex justify-between items-center group hover:border-zinc-700 transition">
        <div>
          <h4 class="font-medium text-white">{{ getUserName(item.idUsuario) }}</h4>
          <p class="text-xs text-zinc-500 mt-1">{{ item.observaciones || 'Sin observaciones' }}</p>
        </div>
        <div class="text-center">
            <span class="text-xl font-bold text-white">{{ item.diasAcumulados }}</span>
            <p class="text-[10px] text-zinc-500 uppercase tracking-wider">Días</p>
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
