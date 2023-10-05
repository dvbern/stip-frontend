import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { SharedUiDropFileComponent } from '@dv/shared/ui/drop-file';

import { DocumentStore } from './shared-pattern-document-upload.store';
import { DocumentOptions } from './shared-pattern-document-upload.model';

@Component({
  selector: 'dv-shared-pattern-document-upload',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    MatFormFieldModule,
    SharedUiDropFileComponent,
  ],
  templateUrl: './shared-pattern-document-upload.component.html',
  styleUrls: ['./shared-pattern-document-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DocumentStore],
})
export class SharedPatternDocumentUploadComponent implements OnChanges {
  private store = inject(DocumentStore);

  @Input({ required: true }) options!: DocumentOptions;

  view = this.store.selectSignal((state) => state);
  hasEntriesSig = computed(() => {
    const view = this.view();
    return view.documents.length > 0 || (view.errors?.length ?? 0) > 0;
  });

  ngOnChanges() {
    this.store.effectGetDocuments(this.options);
  }

  handleMultipleDocumentsAdded(documents: File[]) {
    this.store.effectClearErrors();
    documents.forEach((fileUpload) =>
      this.store.effectUploadDocument({ fileUpload, options: this.options })
    );
  }

  handleFilInputEvent(target: EventTarget | null) {
    if (target && isHTMLInputElement(target) && target.files) {
      this.handleMultipleDocumentsAdded(Array.from(target.files));
      target.value = '';
    }
  }

  handleCancelClicked(dokumentId: string) {
    this.store.cancelDocumentUpload({ dokumentId, options: this.options });
  }

  handleRemoveClicked(dokumentId: string) {
    this.store.effectRemoveDocument({ dokumentId, options: this.options });
  }

  trackByIndex(index: number) {
    return index;
  }
}

const isHTMLInputElement = (
  target: EventTarget
): target is HTMLInputElement => {
  return 'files' in target;
};
