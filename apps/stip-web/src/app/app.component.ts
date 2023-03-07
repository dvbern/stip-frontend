import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';

@Component({
  standalone: true,
  imports: [RouterModule],
  selector: 'stip-web-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'stip-web';
}
