import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-auszahlungen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gesuch-app-feature-gesuch-form-auszahlungen.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-auszahlungen.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormAuszahlungenComponent {}
