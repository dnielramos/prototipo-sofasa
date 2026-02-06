import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UiTextareaComponent } from '../../../../../shared/components/ui-textarea/ui-textarea.component';
import { DashboardStateService } from '../../../dashboard-state.service';
import { IdeaMejora } from '../../../../../core/models/domain.models';
import { MOCK_DB } from '../../../../../core/db/mock-db';

@Component({
    selector: 'app-ideas-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, UiTextareaComponent],
    template: `
    <form [formGroup]="form" (ngSubmit)="save()" class="space-y-4">
      
      <div class="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <p class="text-sm text-blue-400">
          <i class="ph-bold ph-lightbulb mr-2"></i>
          Comparte tus ideas para mejorar los procesos. Tu contribución es valiosa.
        </p>
      </div>

      <app-ui-textarea 
        label="DESCRIPCIÓN DE LA IDEA" 
        formControlName="descripcion"
        placeholder="Describe tu propuesta de mejora con el mayor detalle posible..."
        [rows]="8"
        [showCounter]="true"
        [maxLength]="500"
        [error]="form.get('descripcion')?.touched && form.get('descripcion')?.invalid ? 'Mínimo 50 caracteres' : ''">
      </app-ui-textarea>

      <div class="flex items-center gap-2 text-xs text-zinc-500">
        <i class="ph ph-user"></i>
        <span>Registrado por: {{ getCurrentUser() }}</span>
      </div>

      <div class="pt-4 border-t border-zinc-800 flex justify-end">
        <button 
          type="submit" 
          [disabled]="isSaving || form.invalid"
          class="px-5 py-2.5 rounded-lg text-sm font-medium bg-white text-black hover:bg-zinc-200 transition shadow-lg shadow-white/5 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <i *ngIf="isSaving" class="ph ph-spinner animate-spin text-lg"></i>
          <i *ngIf="!isSaving" class="ph-bold ph-paper-plane-right"></i>
          {{ isSaving ? 'Enviando...' : 'Enviar Idea' }}
        </button>
      </div>
    </form>

    <!-- Lista de Ideas Registradas -->
    <div class="mt-6 space-y-3">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-zinc-400">Ideas Registradas ({{ ideas().length }})</h3>
      </div>

      <div *ngFor="let idea of ideas()" class="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
        <p class="text-sm text-zinc-300 mb-2">{{ idea.descripcion }}</p>
        <div class="flex items-center gap-4 text-xs text-zinc-500">
          <span><i class="ph ph-calendar-blank mr-1"></i>{{ idea.mes }}</span>
          <span><i class="ph ph-user mr-1"></i>{{ getUserName(idea.idUsuario) }}</span>
        </div>
      </div>

      <div *ngIf="ideas().length === 0" class="text-center py-8 text-zinc-500">
        <i class="ph ph-lightbulb text-4xl mb-2 block"></i>
        <p class="text-sm">Aún no hay ideas registradas</p>
      </div>
    </div>
  `
})
export class IdeasFormComponent {
    private fb = inject(FormBuilder);
    private state = inject(DashboardStateService);

    form: FormGroup;
    isSaving = false;
    ideas = signal<IdeaMejora[]>(MOCK_DB.ideasMejora);

    constructor() {
        this.form = this.fb.group({
            descripcion: ['', [Validators.required, Validators.minLength(50), Validators.maxLength(500)]]
        });
    }

    getCurrentUser(): string {
        return MOCK_DB.usuarios[0]?.nombre || 'Usuario Actual';
    }

    getUserName(userId: string): string {
        return MOCK_DB.usuarios.find(u => u.id === userId)?.nombre || 'Desconocido';
    }

    save() {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }

        this.isSaving = true;

        setTimeout(() => {
            const nueva: IdeaMejora = {
                id: `idea-${Date.now()}`,
                idProyecto: 'p-1',
                mes: new Date().toISOString().slice(0, 7),
                descripcion: this.form.value.descripcion,
                idUsuario: 'u-1'
            };

            this.state.addIdea(nueva);
            this.ideas.update(list => [...list, nueva]);
            this.form.reset();
            this.isSaving = false;
        }, 600);
    }
}
