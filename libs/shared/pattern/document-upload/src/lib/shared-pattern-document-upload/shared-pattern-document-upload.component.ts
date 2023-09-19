import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';

import { SharedUiDropFileComponent } from '@dv/shared/ui/drop-file';

import { DocumentStore } from './shared-pattern-document-upload.store';
import { DocumentOptions } from './shared-pattern-document-upload.model';

@Component({
  selector: 'dv-shared-pattern-document-upload',
  standalone: true,
  imports: [CommonModule, TranslateModule, SharedUiDropFileComponent],
  templateUrl: './shared-pattern-document-upload.component.html',
  styleUrls: ['./shared-pattern-document-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DocumentStore],
})
export class SharedPatternDocumentUploadComponent implements OnChanges {
  private store = inject(DocumentStore);

  filesDropped = new EventEmitter<File[]>();
  removeTrigger = new Subject<string>();

  @Input({ required: true }) options!: DocumentOptions;

  view = this.store.selectSignal((state) => state);

  ngOnChanges() {
    this.store.effectGetDocuments(this.options);
  }

  handleMultipleDocumentsAdded(documents: File[]) {
    documents.forEach((fileUpload) =>
      this.store.effectUploadDocument({ fileUpload, options: this.options })
    );
  }

  handleDocumentAdded(fileUpload: File) {
    this.store.effectUploadDocument({ fileUpload, options: this.options });
  }

  handleCancelClicked(dokumentId: string) {
    this.store.effectCancelDocument({ dokumentId, options: this.options });
  }

  handleRemoveClicked(dokumentId: string) {
    this.store.effectRemoveDocument({ dokumentId, options: this.options });
  }

  trackByIndex(index: number) {
    return index;
  }
}
