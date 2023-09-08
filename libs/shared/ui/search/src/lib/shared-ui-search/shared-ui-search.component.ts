import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dv-shared-ui-search',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, TranslateModule],
  templateUrl: './shared-ui-search.component.html',
  styleUrls: ['./shared-ui-search.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiSearchComponent {}
