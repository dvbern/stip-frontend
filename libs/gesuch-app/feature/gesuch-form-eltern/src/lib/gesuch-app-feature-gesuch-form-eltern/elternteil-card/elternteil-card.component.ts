import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { Anrede, ElternDTO, LebenslaufItemDTO } from '@dv/shared/model/gesuch';
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
  elternteil!: ElternDTO | undefined;
  @Input({ required: true })
  geschlecht!: Anrede;
  @Input({ required: true })
  translationkey!: string;
  @Output()
  editTriggered = new EventEmitter<ElternDTO>();
  @Output()
  addTriggered = new EventEmitter<Anrede>();

  handleClick() {
    if (this.elternteil) {
      this.editTriggered.emit(this.elternteil);
    } else {
      this.addTriggered.emit(this.geschlecht);
    }
  }
}
