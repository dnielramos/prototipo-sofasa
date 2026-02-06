import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInputComponent } from '../../../../../shared/components/ui-input/ui-input.component';
import { UiSelectComponent } from '../../../../../shared/components/ui-select/ui-select.component';
import { UiTextareaComponent } from '../../../../../shared/components/ui-textarea/ui-textarea.component';
import { DashboardStateService } from '../../../dashboard-state.service';
import { CumplimientoTareas } from '../../../../../core/models/domain.models';
import { MOCK_DB } from '../../../../../core/db/mock-db';

@Component({
  selector: 'app-tareas-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiInputComponent, UiSelectComponent, UiTextareaComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()" class="space-y-6">
      
      <!-- TABLA 13: Cumplimiento_Tareas_Plazos (ENCABEZADO) -->
      <div class="space-y-4">
        <h4 class="text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-800 pb-2">
            1. Encabezado de Evaluación
        </h4>
        
        <app-ui-select 
            label="COLABORADOR EVALUADO" 
            formControlName="idUsuario"
            [error]="form.get('idUsuario')?.touched && form.get('idUsuario')?.invalid ? 'Requerido' : ''">
            <option value="">Seleccione...</option>
            <option *ngFor="let u of usuarios" [value]="u.id">{{ u.nombre }}</option>
        </app-ui-select>

        <div class="grid grid-cols-2 gap-4">
            <app-ui-select 
            label="ÁREA" 
            formControlName="area"
            [error]="form.get('area')?.touched && form.get('area')?.invalid ? 'Requerido' : ''">
            <option value="">Seleccione...</option>
            <option value="Ensamble">Ensamble</option>
            <option value="Pintura">Pintura</option>
            <option value="Calidad">Calidad</option>
            <option value="Logística">Logística</option>
            <option value="RRHH">RRHH</option>
            </app-ui-select>

            <app-ui-input 
            label="PROMEDIO DESEMPEÑO (%)" 
            type="number" 
            formControlName="promedioDesempeno"
            placeholder="0-100"
            [error]="form.get('promedioDesempeno')?.touched && form.get('promedioDesempeno')?.invalid ? 'Requerido 0-100' : ''">
            </app-ui-input>
        </div>
      </div>

      <!-- TABLA 14: Objetivos_Cumplimiento_Detalle (DETALLE HIJO) -->
      <div class="space-y-4 pt-2">
        <div class="flex justify-between items-end border-b border-zinc-800 pb-2">
            <h4 class="text-xs font-bold text-zinc-500 uppercase tracking-wider">
                2. Informe Cualitativo (Detalle)
            </h4>
            <span class="text-[10px] text-zinc-500" 
                [ngClass]="{'text-rose-500': form.get('informeMes')?.errors?.['minlength'] || form.get('informeMes')?.errors?.['maxlength']}">
                Min 350 - Max 500 caracteres
            </span>
        </div>

        <app-ui-textarea 
            label="INFORME DEL MES" 
            formControlName="informeMes"
            placeholder="Describa detalladamente el cumplimiento de objetivos del colaborador en este periodo..."
            [rows]="5"
            [showCounter]="true"
            [maxLength]="500"
            [error]="getInformeError()">
        </app-ui-textarea>

        <p class="text-xs text-zinc-500 italic">
            * Este informe se almacenará en la tabla de detalle vinculada.
        </p>
      </div>

      <div class="pt-4 border-t border-zinc-800 flex justify-end">
        <button 
          type="submit" 
          [disabled]="isSaving || form.invalid"
          class="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <i *ngIf="isSaving" class="ph ph-spinner animate-spin text-lg"></i>
          <i *ngIf="!isSaving" class="ph-bold ph-read-cv-logo"></i>
          {{ isSaving ? 'Guardar Evaluación Completa' : 'Guardar Evaluación' }}
        </button>
      </div>
    </form>

    <!-- List View -->
    <div class="mt-6 space-y-3">
      <h3 class="text-sm font-medium text-zinc-400">Evaluaciones ({{ tareas().length }})</h3>

      <div *ngFor="let item of tareas()" class="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        <div class="flex justify-between items-center mb-2">
            <div>
                 <h4 class="font-medium text-white">{{ getUserName(item.idUsuario) }}</h4>
                 <span class="text-xs text-zinc-500">{{ item.area }}</span>
            </div>
            <span class="text-xl font-bold" [ngClass]="{
                'text-emerald-500': item.promedioDesempeno >= 90,
                'text-yellow-500': item.promedioDesempeno >= 70 && item.promedioDesempeno < 90,
                'text-rose-500': item.promedioDesempeno < 70
            }">{{ item.promedioDesempeno }}%</span>
        </div>
      </div>
    </div>
  `
})
export class TareasFormComponent {
  private fb = inject(FormBuilder);
  private state = inject(DashboardStateService);

  form: FormGroup;
  isSaving = false;
  usuarios = MOCK_DB.usuarios;
  tareas = signal<CumplimientoTareas[]>(MOCK_DB.cumplimientoTareas);

  constructor() {
    this.form = this.fb.group({
      // Encabezado
      idUsuario: ['', Validators.required],
      area: ['', Validators.required],
      promedioDesempeno: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      // Detalle (Table 14)
      informeMes: ['', [Validators.required, Validators.minLength(350), Validators.maxLength(500)]]
    });
  }

  getUserName(userId: string): string {
    return this.usuarios.find(u => u.id === userId)?.nombre || 'Desconocido';
  }

  getInformeError(): string {
    const control = this.form.get('informeMes');
    if (control?.touched && control?.errors) {
      if (control.errors['required']) return 'El informe es obligatorio';
      if (control.errors['minlength']) return `Mínimo 350 caracteres (actual: ${control.value.length})`;
      if (control.errors['maxlength']) return 'Máximo 500 caracteres';
    }
    return '';
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    setTimeout(() => {
      // In a real API call, we would post to /api/evaluaciones which handles transaction for both tables
      const nuevo: CumplimientoTareas = {
        id: `tarea-${Date.now()}`,
        idProyecto: 'p-1',
        ...this.form.value
        // Note: 'informeMes' is technically part of the child table in SQL
        // In our frontend Domain model, we might flatten it or store it in a sub-object.
        // For this Prototype, we persist it in the object but acknowledge the architectural split.
      };

      this.state.addTarea(nuevo);
      this.tareas.update(list => [...list, nuevo]);
      this.form.reset();
      this.isSaving = false;
    }, 600);
  }
}
