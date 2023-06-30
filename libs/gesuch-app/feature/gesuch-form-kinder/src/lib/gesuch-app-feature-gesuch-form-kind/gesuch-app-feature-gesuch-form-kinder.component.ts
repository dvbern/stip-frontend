import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormKinder } from '@dv/gesuch-app/event/gesuch-form-kinder';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { KindDTO, SharedModelGesuch } from '@dv/shared/model/gesuch';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { GesuchAppFeatureGesuchFormKinderEditorComponent } from '../gesuch-app-feature-gesuch-form-kind-editor/gesuch-app-feature-gesuch-form-kind-editor.component';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-kinder',
  standalone: true,
  imports: [
    CommonModule,
    GesuchAppPatternGesuchStepLayoutComponent,
    TranslateModule,
    NgbAlert,
    GesuchAppFeatureGesuchFormKinderEditorComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-kinder.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-kinder.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormKinderComponent implements OnInit {
  private store = inject(Store);

  view$ = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  protected readonly GesuchFormSteps = GesuchFormSteps;

  editedKind?: Partial<KindDTO>;

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormKinder.init());
  }

  public handleAddKinder(): void {
    this.editedKind = {};
  }

  public handleEditKinder(ge: KindDTO): void {
    this.editedKind = ge;
  }

  handleEditorSave(kind: KindDTO) {
    this.store.dispatch(
      GesuchAppEventGesuchFormKinder.saveSubformTriggered({
        gesuch: this.buildUpdatedGesuchWithUpdatedKind(kind),
        origin: GesuchFormSteps.KINDER,
      })
    );
    this.editedKind = undefined;
  }

  public handleDeleteKinder(kinder: KindDTO) {
    this.store.dispatch(
      GesuchAppEventGesuchFormKinder.saveSubformTriggered({
        gesuch: this.buildUpdatedGesuchWithDeletedKinder(kinder),
        origin: GesuchFormSteps.KINDER,
      })
    );
    this.editedKind = undefined;
  }

  handleContinue() {
    const { gesuch } = this.view$();
    this.store.dispatch(
      GesuchAppEventGesuchFormKinder.nextTriggered({
        id: gesuch!.id!,
        origin: GesuchFormSteps.KINDER,
      })
    );
  }

  handleEditorClose() {
    this.editedKind = undefined;
  }

  private buildUpdatedGesuchWithDeletedKinder(kinder: KindDTO) {
    const gesuch: Partial<SharedModelGesuch> = this.view$().gesuch!;
    const updatedKinderContainers = gesuch?.kindContainers!.filter(
      (kinderContainer) => kinderContainer.kindSB?.id !== kinder.id
    );

    return {
      ...gesuch,
      kinderContainers: updatedKinderContainers,
    };
  }

  private buildUpdatedGesuchWithUpdatedKind(kind: KindDTO) {
    const gesuch: Partial<SharedModelGesuch> = this.view$().gesuch!;
    // update existing kind if found
    const updatedKinderContainers =
      gesuch?.kindContainers?.map((kindContainer) => {
        if (kindContainer.kindSB?.id === kind.id) {
          return {
            ...kindContainer,
            kindSB: kind,
          };
        } else {
          return kindContainer;
        }
      }) ?? [];
    // add new kind if not found
    if (!kind.id) {
      // TODO new kind doesnt have ID, will be added by backend?
      updatedKinderContainers.push({
        kindSB: {
          ...kind,
          id: 'generated by backend? or FE uuid?' + kind.vorname,
        },
        id: 'generated by backend? or FE uuid?' + kind.vorname,
      });
    }
    return {
      ...gesuch,
      kindContainers: updatedKinderContainers,
    };
  }

  trackByIndex(index: number) {
    return index;
  }

  public asKinder(kinderRaw: KindDTO): KindDTO {
    return kinderRaw;
  }
}
