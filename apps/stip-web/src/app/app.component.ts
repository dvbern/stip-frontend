import { RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import {StipLibModule} from "@stip-web/stip-lib";

@Component({
  standalone: true,
    imports: [RouterModule, StipLibModule],
  selector: 'stip-web-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent {
  title = 'stip-web';
}
