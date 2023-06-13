import { Component } from '@angular/core';

import { GesuchAppPatternMainLayoutComponent } from '@dv/gesuch-app/pattern/main-layout';

@Component({
  standalone: true,
  imports: [GesuchAppPatternMainLayoutComponent],
  selector: 'dv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
