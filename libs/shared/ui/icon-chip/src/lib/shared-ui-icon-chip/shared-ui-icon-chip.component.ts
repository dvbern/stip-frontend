import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'dv-shared-ui-icon-chip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-ui-icon-chip.component.html',
  styleUrls: ['./shared-ui-icon-chip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiIconChipComponent {}
