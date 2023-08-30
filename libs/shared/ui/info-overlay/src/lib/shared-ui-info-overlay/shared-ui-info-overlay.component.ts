import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  BlockScrollStrategy,
  CdkConnectedOverlay,
  ConnectionPositionPair,
  OverlayModule,
  ScrollStrategy,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import {
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
} from 'rxjs/operators';

@Component({
  selector: 'dv-shared-ui-info-overlay',
  standalone: true,
  imports: [CommonModule, OverlayModule, TranslateModule],
  templateUrl: './shared-ui-info-overlay.component.html',
  styleUrls: ['./shared-ui-info-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiInfoOverlayComponent implements AfterViewInit {
  @Input() isOpen = false;
  @Output() closeOverlay = new EventEmitter<boolean>();
  public positions = [
    new ConnectionPositionPair(
      {
        originX: 'start',
        originY: 'top',
      },
      {
        overlayX: 'start',
        overlayY: 'top',
      }
    ),
  ];
  private viewPortRuler = inject(ViewportRuler);
  private document = inject(DOCUMENT);
  @ViewChild('overlay', { static: true, read: CdkConnectedOverlay })
  private overlay!: CdkConnectedOverlay;
  private afterViewInit$ = new Subject<void>();
  private blockScrollStrategy = new BlockScrollStrategy(
    this.viewPortRuler,
    this.document
  );
  public currentScrollStrategy!: ScrollStrategy;

  constructor() {
    this.afterViewInit$
      .pipe(
        switchMap(() => {
          const originalScrollStrategy = this.overlay.scrollStrategy;
          return this.viewPortRuler.change(100).pipe(
            startWith(null),
            map(() =>
              this.viewPortRuler.getViewportSize().width >= 768
                ? 'free'
                : 'block'
            ),
            distinctUntilChanged(),
            map((type) => ({ type, originalScrollStrategy }))
          );
        }),
        takeUntilDestroyed()
      )
      .subscribe(({ type, originalScrollStrategy }) => {
        this.overlay.scrollStrategy =
          type === 'block' ? this.blockScrollStrategy : originalScrollStrategy;
        if (this.overlay.overlayRef) {
          this.overlay.overlayRef?.updateScrollStrategy(
            this.overlay.scrollStrategy
          );
        }
      });
  }

  ngAfterViewInit() {
    this.afterViewInit$.next();
    this.afterViewInit$.complete();
  }
}
