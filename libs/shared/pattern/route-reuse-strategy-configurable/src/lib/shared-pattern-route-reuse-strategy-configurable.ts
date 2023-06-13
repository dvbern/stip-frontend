import {
  ActivatedRouteSnapshot,
  RouteReuseStrategy,
  BaseRouteReuseStrategy,
} from '@angular/router';

/**
 * Fine-grained control over route reuse.
 *
 * Overriding default Angular route reuse strategy allows us
 * to reinitialize a component when navigated to the same route.
 *
 * Reuse behavior can be customized by specifying a `shouldReuseRoute` boolean flag in the route data.
 * If this flag is not specified, the default Angular behavior is used.
 */
export function provideSharedPatternRouteReuseStrategyConfigurable() {
  return [
    {
      provide: RouteReuseStrategy,
      useClass: SharedPatternRouteReuseStrategyConfigurable,
    },
  ];
}

export class SharedPatternRouteReuseStrategyConfigurable extends BaseRouteReuseStrategy {
  constructor() {
    super();
  }
  override shouldReuseRoute(
    future: ActivatedRouteSnapshot,
    curr: ActivatedRouteSnapshot
  ): boolean {
    if (future.data['shouldReuseRoute'] === false) {
      return false;
    }
    return super.shouldReuseRoute(future, curr);
  }
}
