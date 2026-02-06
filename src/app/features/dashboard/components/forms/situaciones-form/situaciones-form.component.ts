import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInputComponent } from '../../../../../shared/components/ui-input/ui-input.component';
import { UiSelectComponent } from '../../../../../shared/components/ui-select/ui-select.component';
import { UiTextareaComponent } from '../../../../../shared/components/ui-textarea/ui-textarea.component';
import { DashboardStateService } from '../../../dashboard-state.service';
import { SituacionEspecial } from '../../../../../core/models/domain.models';
import { MOCK_DB } from '../../../../../core/db/mock-db';
import { CAT_TIPOS_SITUACION } from '../../../../../core/db/catalogs.db';

@Component({
  selector: 'app-situaciones-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiInputComponent, UiSelectComponent, UiTextareaComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
      
      <div class="grid grid-cols-2 gap-4">
        <!-- Tabla 5: Cat_Tipos_Situacion -->
        <app-ui-select 
            label="TIPO SITUACIÓN (CATÁLOGO)" 
            formControlName="tipoSituacion"
            [error]="form.get('tipoSituacion')?.touched && form.get('tipoSituacion')?.invalid ? 'Requerido' : ''">
            <option value="">Seleccione...</option>
            <option *ngFor="let cat of catalogos" [value]="cat.nombre">{{ cat.nombre }}</option>
        </app-ui-select>

        <app-ui-input 
            label="CANTIDAD CASOS" 
            type="number" 
            formControlName="cantidad"
            placeholder="0"
            [error]="form.get('cantidad')?.touched && form.get('cantidad')?.invalid ? 'Requerido' : ''">
        </app-ui-input>
      </div>
      
      <app-ui-input 
            label="BASE POBLACIÓN (DENOMINADOR)" 
            type="number" 
            formControlName="cantidadPersonasMesUsuarios"
            placeholder="Total empleados activos"
            [error]="form.get('cantidadPersonasMesUsuarios')?.touched && form.get('cantidadPersonasMesUsuarios')?.invalid ? 'Requerido' : ''">
      </app-ui-input>

      <app-ui-textarea 
        label="OBSERVACIONES" 
        formControlName="observaciones"
        placeholder="Nombres o detalles específicos..."
        [rows]="3"
        [maxLength]="500">
      </app-ui-textarea>

      <div class="pt-4 border-t border-gray-200 flex justify-end">
        <button 
          type="submit" 
          [disabled]="isSaving || form.invalid"
          class="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <i *ngIf="isSaving" class="ph ph-spinner animate-spin text-lg"></i>
          <i *ngIf="!isSaving" class="ph-bold ph-warning-circle"></i>
          {{ isSaving ? 'Guardar Caso' : 'Registrar Caso' }}
        </button>
      </div>
    </form>

    <!-- List View -->
    <div class="mt-6 space-y-3">
      <h3 class="text-sm font-medium text-gray-700">Casos ({{ situaciones().length }})</h3>

      <div *ngFor="let item of situaciones()" class="p-4 bg-white border border-gray-200 rounded-xl">
        <div class="flex justify-between items-center mb-2">
          <div class="flex gap-2">
            <span *ngFor="let s of item.situacion" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {{ s }}
            </span>
          </div>
          <span class="text-sm text-gray-700">{{ item.cantidad }} casos</span>
        </div>
      </div>
    </div>
  `
})
export class SituacionesFormComponent {
  private fb = inject(FormBuilder);
  private state = inject(DashboardStateService);

  form: FormGroup;
  isSaving = false;
  situaciones = signal<SituacionEspecial[]>(MOCK_DB.situaciones);

  // Load from Catalog DB
  catalogos = CAT_TIPOS_SITUACION;

  constructor() {
    this.form = this.fb.group({
      tipoSituacion: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      cantidadPersonasMesUsuarios: [342, [Validators.required, Validators.min(1)]],
      observaciones: ['']
    });
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    setTimeout(() => {
      const val = this.form.value;
      const pct = (val.cantidad / val.cantidadPersonasMesUsuarios) * 100;

      const nueva: SituacionEspecial = {
        id: `sit-${Date.now()}`,
        idProyecto: 'p-1',
        mes: new Date().toISOString().slice(0, 7),
        situacion: [val.tipoSituacion],
        cantidad: val.cantidad,
        cantidadPersonasMesUsuarios: val.cantidadPersonasMesUsuarios,
        porcentajeSituacion: pct,
        objetivo: 0,
        observaciones: val.observaciones
      };

      this.state.addSituacion(nueva);
      this.situaciones.update(list => [...list, nueva]);
      this.form.reset({
        cantidad: 1,
        cantidadPersonasMesUsuarios: 342
      });
      this.isSaving = false;
    }, 600);
  }
}
