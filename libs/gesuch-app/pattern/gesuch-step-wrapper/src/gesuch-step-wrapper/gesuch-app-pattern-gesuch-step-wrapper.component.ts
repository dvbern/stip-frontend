import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { map } from 'rxjs/operators';

import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';

@Component({
  selector: 'dv-gesuch-app-pattern-gesuch-step-wrapper',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    GesuchAppPatternGesuchStepLayoutComponent,
  ],
  templateUrl: './gesuch-app-pattern-gesuch-step-wrapper.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternGesuchStepWrapperComponent {
  @ViewChild('outlet', { read: RouterOutlet, static: true })
  outlet!: RouterOutlet;
  activated$ = new EventEmitter();
  step$ = this.activated$.pipe(
    map(() => this.outlet.activatedRoute.snapshot.data['step'])
  );
}
