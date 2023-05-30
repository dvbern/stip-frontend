import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  Input,
  OnChanges,
} from '@angular/core';

@Component({
  selector: 'dv-shared-ui-progress-bar',
  standalone: true,
  imports: [],
  templateUrl: './shared-ui-progress-bar.component.html',
  styleUrls: ['./shared-ui-progress-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiProgressBarComponent implements OnChanges {
  @Input() current = 0;
  @Input() total = 0;

  @HostBinding('style.--progress') progress = 0;

  ngOnChanges() {
    this.progress = (this.current / this.total) * 100;
  }
}
