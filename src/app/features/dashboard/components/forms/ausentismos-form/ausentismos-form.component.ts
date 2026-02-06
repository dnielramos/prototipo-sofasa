import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiInputComponent } from '../../../../../shared/components/ui-input/ui-input.component';
import { UiSelectComponent } from '../../../../../shared/components/ui-select/ui-select.component';
import { UiTextareaComponent } from '../../../../../shared/components/ui-textarea/ui-textarea.component';
import { DashboardStateService } from '../../../dashboard-state.service';
import { Ausentismo } from '../../../../../core/models/domain.models';
import { MOCK_DB } from '../../../../../core/db/mock-db';
import { CAT_TIPOS_AUSENTISMO } from '../../../../../core/db/catalogs.db';

@Component({
  selector: 'app-ausentismos-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UiInputComponent, UiSelectComponent, UiTextareaComponent],
  template: `
    <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
      
      <!-- Usuario Selector (Table: Usuarios) -->
      <app-ui-select 
        label="COLABORADOR" 
        formControlName="idUsuario"
        [error]="form.get('idUsuario')?.touched && form.get('idUsuario')?.invalid ? 'Requerido' : ''">
        <option value="">Seleccione...</option>
        <option *ngFor="let u of usuarios" [value]="u.id">{{ u.nombre }} - {{ u.cargoSofasa }}</option>
      </app-ui-select>

      <!-- Tabla 4: Cat_Tipos_Ausentismo -->
      <app-ui-select 
        label="TIPO DE AUSENTISMO (CATÁLOGO)" 
        formControlName="tipoAusentismo"
        [error]="form.get('tipoAusentismo')?.touched && form.get('tipoAusentismo')?.invalid ? 'Requerido' : ''">
        <option value="">Seleccione...</option>
        <option *ngFor="let cat of catalogos" [value]="cat.nombre">{{ cat.nombre }}</option>
      </app-ui-select>

      <div class="grid grid-cols-2 gap-4">
        <app-ui-input 
          label="DÍAS DE AUSENCIA" 
          type="number" 
          formControlName="diasTotalAusencia"
          placeholder="0"
          [error]="form.get('diasTotalAusencia')?.touched && form.get('diasTotalAusencia')?.invalid ? 'Requerido' : ''">
        </app-ui-input>

        <app-ui-input 
          label="DÍAS LABORALES TOTALES" 
          type="number" 
          formControlName="diasLaboralesTotales"
          placeholder="Ej: 30"
          [error]="form.get('diasLaboralesTotales')?.touched && form.get('diasLaboralesTotales')?.invalid ? 'Requerido' : ''">
        </app-ui-input>
      </div>

      <app-ui-textarea 
        label="OBSERVACIONES" 
        formControlName="observaciones"
        placeholder="Detalles adicionales..."
        [rows]="3"
        [maxLength]="500">
      </app-ui-textarea>

      <div class="pt-4 border-t border-zinc-800 flex justify-end">
        <button 
          type="submit" 
          [disabled]="isSaving || form.invalid"
          class="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <i *ngIf="isSaving" class="ph ph-spinner animate-spin text-lg"></i>
          <i *ngIf="!isSaving" class="ph-bold ph-plus"></i>
          {{ isSaving ? 'Guardar Registro' : 'Registrar Ausentismo' }}
        </button>
      </div>
    </form>

    <!-- List View -->
    <div class="mt-6 space-y-3">
      <h3 class="text-sm font-medium text-zinc-400">Registros ({{ ausentismos().length }})</h3>

      <div *ngFor="let item of ausentismos()" class="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        <div class="flex justify-between items-start mb-2">
          <div>
            <h4 class="font-medium text-white">{{ getUserName(item.idUsuario) }}</h4>
            <div class="flex gap-2 mt-1">
                <!-- Honors the Array Structure in display -->
                <span *ngFor="let t of item.tipoAusentismo" class="text-xs px-2 py-0.5 bg-rose-500/10 text-rose-400 rounded-full border border-rose-500/20">{{ t }}</span>
            </div>
          </div>
          <span class="text-xl font-bold text-white">{{ item.diasTotalAusencia }} <span class="text-xs font-normal text-zinc-500">días</span></span>
        </div>
      </div>
    </div>
  `
})
export class AusentismosFormComponent {
  private fb = inject(FormBuilder);
  private state = inject(DashboardStateService);

  form: FormGroup;
  isSaving = false;
  usuarios = MOCK_DB.usuarios;
  ausentismos = signal<Ausentismo[]>(MOCK_DB.ausentismos);

  // Load from Catalog DB
  catalogos = CAT_TIPOS_AUSENTISMO;

  constructor() {
    this.form = this.fb.group({
      idUsuario: ['', Validators.required],
      tipoAusentismo: ['', Validators.required],
      diasTotalAusencia: [0, [Validators.required, Validators.min(0.5)]],
      diasLaboralesTotales: [20, [Validators.required, Validators.min(1)]],
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
      const val = this.form.value;
      const pct = (val.diasTotalAusencia / (val.diasLaboralesTotales * 1)) * 100;

      const nuevo: Ausentismo = {
        id: `aus-${Date.now()}`,
        idProyecto: 'p-1',
        mes: new Date().toISOString().slice(0, 7),
        // DB bridge table simulation: store as array
        tipoAusentismo: [val.tipoAusentismo],
        idUsuario: val.idUsuario,
        diasTotalAusencia: val.diasTotalAusencia,
        diasLaboralesTotales: val.diasLaboralesTotales,
        porcentajeAusentismo: pct,
        objetivo: 2,
        observaciones: val.observaciones
      };

      this.state.addAusentismo(nuevo);
      this.ausentismos.update(list => [...list, nuevo]);
      this.form.reset({
        diasLaboralesTotales: 20
      });
      this.isSaving = false;
    }, 600);
  }
}
