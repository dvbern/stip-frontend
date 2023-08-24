import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import {
  ConnectionPositionPair,
  OverlayModule,
  ScrollStrategy,
  ViewportRuler,
} from '@angular/cdk/overlay';
import { coerceCssPixelValue } from '@angular/cdk/coercion';
import { TranslateModule } from '@ngx-translate/core';
import { supportsScrollBehavior } from '@angular/cdk/platform';

const scrollBehaviorSupported = supportsScrollBehavior();

// TODO: Check if it is somehow possible to use the default BlockScrollStrategy
class BlockSmScrollStrategy implements ScrollStrategy {
  private _previousHTMLStyles = { top: '', left: '' };
  private _previousScrollPosition!: { top: number; left: number };
  private _isEnabled = false;
  private _document: Document;

  constructor(private _viewportRuler: ViewportRuler, document: any) {
    this._document = document;
  }

  /** Attaches this scroll strategy to an overlay. */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  attach() {}

  /** Blocks page-level scroll while the attached overlay is open. */
  enable() {
    if (this._canBeEnabled()) {
      const root = this._document.documentElement!;

      this._previousScrollPosition =
        this._viewportRuler.getViewportScrollPosition();

      // Cache the previous inline styles in case the user had set them.
      this._previousHTMLStyles.left = root.style.left || '';
      this._previousHTMLStyles.top = root.style.top || '';

      // Note: we're using the `html` node, instead of the `body`, because the `body` may
      // have the user agent margin, whereas the `html` is guaranteed not to have one.
      root.style.left = coerceCssPixelValue(-this._previousScrollPosition.left);
      root.style.top = coerceCssPixelValue(-this._previousScrollPosition.top);
      root.classList.add('cdk-global-scrollblock');
      this._isEnabled = true;
    }
  }

  /** Unblocks page-level scroll while the attached overlay is open. */
  disable() {
    if (this._isEnabled) {
      const html = this._document.documentElement!;
      const body = this._document.body!;
      const htmlStyle = html.style;
      const bodyStyle = body.style;
      const previousHtmlScrollBehavior = htmlStyle.scrollBehavior || '';
      const previousBodyScrollBehavior = bodyStyle.scrollBehavior || '';

      this._isEnabled = false;

      htmlStyle.left = this._previousHTMLStyles.left;
      htmlStyle.top = this._previousHTMLStyles.top;
      html.classList.remove('cdk-global-scrollblock');

      // Disable user-defined smooth scrolling temporarily while we restore the scroll position.
      // See https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
      // Note that we don't mutate the property if the browser doesn't support `scroll-behavior`,
      // because it can throw off feature detections in `supportsScrollBehavior` which
      // checks for `'scrollBehavior' in documentElement.style`.
      if (scrollBehaviorSupported) {
        htmlStyle.scrollBehavior = bodyStyle.scrollBehavior = 'auto';
      }

      window.scroll(
        this._previousScrollPosition.left,
        this._previousScrollPosition.top
      );

      if (scrollBehaviorSupported) {
        htmlStyle.scrollBehavior = previousHtmlScrollBehavior;
        bodyStyle.scrollBehavior = previousBodyScrollBehavior;
      }
    }
  }

  private _canBeEnabled(): boolean {
    // Since the scroll strategies can't be singletons, we have to use a global CSS class
    // (`cdk-global-scrollblock`) to make sure that we don't try to disable global
    // scrolling multiple times.
    const html = this._document.documentElement!;

    if (html.classList.contains('cdk-global-scrollblock') || this._isEnabled) {
      return false;
    }

    const body = this._document.body;
    const viewport = this._viewportRuler.getViewportSize();
    return (
      viewport.width <= 768 &&
      (body.scrollHeight > viewport.height || body.scrollWidth > viewport.width)
    );
  }
}

@Component({
  selector: 'dv-shared-ui-info-overlay',
  standalone: true,
  imports: [CommonModule, OverlayModule, TranslateModule],
  templateUrl: './shared-ui-info-overlay.component.html',
  styleUrls: ['./shared-ui-info-overlay.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedUiInfoOverlayComponent {
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
  private dcmnt = inject(DOCUMENT);
  scrollStrategy = new BlockSmScrollStrategy(this.viewPortRuler, this.dcmnt);
}
