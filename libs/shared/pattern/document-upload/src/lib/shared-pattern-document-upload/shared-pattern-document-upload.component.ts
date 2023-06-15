import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';

import { DocumentStore } from './shared-pattern-document-upload.store';
import { DocumentService } from './shared-pattern-document-upload.service';
import { DocumentOptions } from './shared-pattern-document-upload.model';

@Component({
  selector: 'dv-shared-pattern-document-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shared-pattern-document-upload.component.html',
  styleUrls: ['./shared-pattern-document-upload.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DocumentStore, DocumentService],
})
export class SharedPatternDocumentUploadComponent implements OnChanges {
  private store = inject(DocumentStore);

  removeTrigger = new Subject<string>();

  @Input({ required: true }) options!: DocumentOptions;

  view = this.store.selectSignal((state) => state);

  ngOnChanges() {
    this.store.effectGetDocuments(this.options);
  }

  handleDocumentAdded(document: File) {
    this.store.effectUploadDocument({ document, options: this.options });
  }

  handleRemoveClicked(documentId: string) {
    this.store.effectRemoveDocument({ documentId, options: this.options });
  }

  trackByIndex(index: number) {
    return index;
  }
}
