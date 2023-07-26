import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GesuchAppPatternMainLayoutComponent } from '@dv/gesuch-app/pattern/main-layout';
import { TranslateModule } from '@ngx-translate/core';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
import { HttpClient } from '@angular/common/http';
import { Benutzer } from '@dv/shared/model/gesuch';
import { Router } from '@angular/router';

@Component({
  selector: 'dv-gesuch-app-feature-user-select',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SharedUiIconChipComponent,
    GesuchAppPatternMainLayoutComponent,
  ],
  templateUrl: './gesuch-app-feature-user-select.component.html',
  styleUrls: ['./gesuch-app-feature-user-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureUserSelectComponent {
  http = inject(HttpClient);
  router = inject(Router);
  users$ = this.http.get<Benutzer[]>('/api/v1/benutzer');

  trackByIndex(index: number) {
    return index;
  }

  setUser(userId: string) {
    localStorage.setItem('userId', userId);
    this.router.navigate(['/gesuch-app-feature-cockpit']);
  }
}
