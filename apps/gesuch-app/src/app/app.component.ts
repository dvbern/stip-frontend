import { Component } from '@angular/core';

import { MainLayoutComponent } from '@dv/gesuch-app/pattern/main-layout';

@Component({
  standalone: true,
  imports: [MainLayoutComponent],
  selector: 'dv-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
