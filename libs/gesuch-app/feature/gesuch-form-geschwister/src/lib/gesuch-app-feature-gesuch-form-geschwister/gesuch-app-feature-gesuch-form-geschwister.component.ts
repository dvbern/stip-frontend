import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
} from '@angular/core';
import { selectGesuchAppDataAccessGesuchsView } from '@dv/gesuch-app/data-access/gesuch';
import { GesuchAppEventGesuchFormGeschwister } from '@dv/gesuch-app/event/gesuch-form-geschwister';
import { GesuchFormSteps } from '@dv/gesuch-app/model/gesuch-form';
import { GesuchAppPatternGesuchStepLayoutComponent } from '@dv/gesuch-app/pattern/gesuch-step-layout';
import { GesuchAppUiStepFormButtonsComponent } from '@dv/gesuch-app/ui/step-form-buttons';
import { GeschwisterDTO, SharedModelGesuch } from '@dv/shared/model/gesuch';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { GesuchAppFeatureGesuchFormGeschwisterEditorComponent } from '../gesuch-app-feature-gesuch-form-geschwister-editor/gesuch-app-feature-gesuch-form-geschwister-editor.component';
import { parseBackendLocalDateAndPrint } from '@dv/shared/util/validator-date';
import { selectLanguage } from '@dv/shared/data-access/language';

@Component({
  selector: 'dv-gesuch-app-feature-gesuch-form-geschwister',
  standalone: true,
  imports: [
    CommonModule,
    GesuchAppPatternGesuchStepLayoutComponent,
    TranslateModule,
    NgbAlert,
    GesuchAppFeatureGesuchFormGeschwisterEditorComponent,
    GesuchAppUiStepFormButtonsComponent,
  ],
  templateUrl: './gesuch-app-feature-gesuch-form-geschwister.component.html',
  styleUrls: ['./gesuch-app-feature-gesuch-form-geschwister.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppFeatureGesuchFormGeschwisterComponent implements OnInit {
  private store = inject(Store);

  view$ = this.store.selectSignal(selectGesuchAppDataAccessGesuchsView);

  languageSig = this.store.selectSignal(selectLanguage);

  parseBackendLocalDateAndPrint = parseBackendLocalDateAndPrint;

  sortedGeschwistersSig = computed(() => {
    const originalList = this.view$().gesuch?.geschwisterContainers;
    return originalList
      ? [...originalList].sort((a, b) =>
          (
            a.geschwisterSB!.vorname +
            ' ' +
            a.geschwisterSB!.name
          ).localeCompare(
            b.geschwisterSB!.vorname + ' ' + b.geschwisterSB!.name
          )
        )
      : undefined;
  });

  protected readonly GesuchFormSteps = GesuchFormSteps;

  editedGeschwister?: Partial<GeschwisterDTO>;

  ngOnInit(): void {
    this.store.dispatch(GesuchAppEventGesuchFormGeschwister.init());
  }

  public handleAddGeschwister(): void {
    this.editedGeschwister = {};
  }

  public handleEditGeschwister(ge: GeschwisterDTO): void {
    this.editedGeschwister = ge;
  }

  handleEditorSave(geschwister: GeschwisterDTO) {
    this.store.dispatch(
      GesuchAppEventGesuchFormGeschwister.saveSubformTriggered({
        gesuch: this.buildUpdatedGesuchWithUpdatedGeschwister(geschwister),
        origin: GesuchFormSteps.GESCHWISTER,
      })
    );
    this.editedGeschwister = undefined;
  }

  public handleDeleteGeschwister(geschwister: GeschwisterDTO) {
    this.store.dispatch(
      GesuchAppEventGesuchFormGeschwister.saveSubformTriggered({
        gesuch: this.buildUpdatedGesuchWithDeletedGeschwister(geschwister),
        origin: GesuchFormSteps.GESCHWISTER,
      })
    );
    this.editedGeschwister = undefined;
  }

  handleContinue() {
    const { gesuch } = this.view$();
    this.store.dispatch(
      GesuchAppEventGesuchFormGeschwister.nextTriggered({
        id: gesuch!.id!,
        origin: GesuchFormSteps.GESCHWISTER,
      })
    );
  }

  handleEditorClose() {
    this.editedGeschwister = undefined;
  }

  private buildUpdatedGesuchWithDeletedGeschwister(
    geschwister: GeschwisterDTO
  ) {
    const gesuch: Partial<SharedModelGesuch> = this.view$().gesuch!;
    const updatedGeschwisterContainers = gesuch?.geschwisterContainers!.filter(
      (geschwisterContainer) =>
        geschwisterContainer.geschwisterSB?.id !== geschwister.id
    );

    return {
      ...gesuch,
      geschwisterContainers: updatedGeschwisterContainers,
    };
  }

  private buildUpdatedGesuchWithUpdatedGeschwister(
    geschwister: GeschwisterDTO
  ) {
    const gesuch: Partial<SharedModelGesuch> = this.view$().gesuch!;
    // update existing geschwister if found
    const updatedGeschwisterContainers =
      gesuch?.geschwisterContainers?.map((geschwisterContainer) => {
        if (geschwisterContainer.geschwisterSB?.id === geschwister.id) {
          return {
            ...geschwisterContainer,
            geschwisterSB: geschwister,
          };
        } else {
          return geschwisterContainer;
        }
      }) ?? [];
    // add new geschwister if not found
    if (!geschwister.id) {
      // TODO new geschwister doesnt have ID, will be added by backend?
      updatedGeschwisterContainers.push({
        geschwisterSB: {
          ...geschwister,
          id: 'generated by backend? or FE uuid?' + geschwister.vorname,
        },
        id: 'generated by backend? or FE uuid?' + geschwister.vorname,
      });
    }
    return {
      ...gesuch,
      geschwisterContainers: updatedGeschwisterContainers,
    };
  }

  trackByIndex(index: number) {
    return index;
  }

  public asGeschwister(geschwisterRaw: GeschwisterDTO): GeschwisterDTO {
    return geschwisterRaw;
  }
}
