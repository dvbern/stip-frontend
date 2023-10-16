import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'dv-shared-ui-gesuch-step-wrapper',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shared-ui-gesuch-step-wrapper.component.html',
  styleUrls: ['./shared-ui-gesuch-step-wrapper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiGesuchStepWrapperComponent {
  @ViewChild('outlet', { read: RouterOutlet, static: true })
  public outlet!: RouterOutlet;
  public activated$ = new EventEmitter();
  @Output() public step = this.activated$.pipe(
    map(() => this.outlet.activatedRoute.snapshot.data['step'])
  );
}
