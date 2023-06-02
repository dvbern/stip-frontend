import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NgbOffcanvas, NgbOffcanvasModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { Store } from '@ngrx/store';

import {
  selectLanguage,
  SharedDataAccessLanguageEvents,
} from '@dv/shared/data-access/language';
import { Language } from '@dv/shared/model/language';
import { SharedUiLanguageSelectorComponent } from '@dv/shared/ui/language-selector';

@Component({
  selector: 'dv-gesuch-app-pattern-main-layout-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    TranslateModule,
    RouterLink,
    NgFor,
    NgbOffcanvasModule,
    SharedUiLanguageSelectorComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainLayoutComponent {
  private store = inject(Store);
  private offCanvasService = inject(NgbOffcanvas);

  isScroll = false;

  language = this.store.selectSignal(selectLanguage);

  @ViewChild('menu') menu!: ElementRef;

  @HostListener('window:scroll', ['$event']) handleScroll() {
    this.isScroll = window.scrollY > 0;
  }

  handleLanguageChangeHeader(language: Language) {
    this.store.dispatch(
      SharedDataAccessLanguageEvents.headerMenuSelectorChange({ language })
    );
  }

  handleLanguageChangeFooter(language: Language) {
    this.store.dispatch(
      SharedDataAccessLanguageEvents.footerSelectorChange({ language })
    );
  }

  openMenu() {
    this.offCanvasService.open(this.menu, { position: 'end', scroll: true });
  }
}
