import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ElternTyp, ElternUpdate } from '@dv/shared/model/gesuch';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-eltern-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, SharedUiIconChipComponent],
  templateUrl: './elternteil-card.component.html',
  styleUrls: ['./elternteil-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ElternteilCardComponent {
  @Input({ required: true })
  elternteil!: ElternUpdate | undefined;
  @Input({ required: true })
  elternTyp!: ElternTyp;
  @Input({ required: true })
  translationkey!: string;
  @Output()
  editTriggered = new EventEmitter<ElternUpdate>();
  @Output()
  addTriggered = new EventEmitter<ElternTyp>();

  handleClick() {
    if (this.elternteil) {
      this.editTriggered.emit(this.elternteil);
    } else {
      this.addTriggered.emit(this.elternTyp);
    }
  }
}
