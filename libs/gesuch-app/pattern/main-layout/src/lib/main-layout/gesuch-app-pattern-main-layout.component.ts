import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule, NgFor } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  inject,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterOutlet } from '@angular/router';

import {
  selectLanguage,
  SharedDataAccessLanguageEvents,
} from '@dv/shared/data-access/language';
import { Language } from '@dv/shared/model/language';
import { SharedUiIconChipComponent } from '@dv/shared/ui/icon-chip';
import { SharedUiLanguageSelectorComponent } from '@dv/shared/ui/language-selector';

import {
  NgbDropdown,
  NgbDropdownItem,
  NgbDropdownMenu,
  NgbDropdownToggle,
  NgbOffcanvas,
  NgbOffcanvasModule,
} from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'dv-gesuch-app-pattern-main-layout',
  standalone: true,
  imports: [
    TranslateModule,
    RouterOutlet,
    RouterLink,
    NgFor,
    NgbOffcanvasModule,
    SharedUiLanguageSelectorComponent,
    CommonModule,
    SharedUiIconChipComponent,
    NgbDropdown,
    NgbDropdownToggle,
    NgbDropdownMenu,
    NgbDropdownItem,
  ],
  templateUrl: './gesuch-app-pattern-main-layout.component.html',
  styleUrls: ['./gesuch-app-pattern-main-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GesuchAppPatternMainLayoutComponent {
  private store = inject(Store);
  private offCanvasService = inject(NgbOffcanvas);
  protected breakpointObserver = inject(BreakpointObserver);

  isScroll = false;
  breakpointCompactHeader = '(max-width: 992px)';
  compactHeader = false;
  cd = inject(ChangeDetectorRef);

  language = this.store.selectSignal(selectLanguage);

  @ViewChild('menu') menu!: ElementRef;

  @HostListener('window:scroll', ['$event']) handleScroll() {
    this.isScroll = window.scrollY > 0;
  }

  constructor() {
    this.breakpointObserver
      .observe(this.breakpointCompactHeader)
      .pipe(takeUntilDestroyed())
      .subscribe((result) => {
        this.compactHeader = result.matches;
        this.cd.markForCheck();
      }); // TODO unsubscribe on destroy
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

  protected readonly Breakpoints = Breakpoints;
}
