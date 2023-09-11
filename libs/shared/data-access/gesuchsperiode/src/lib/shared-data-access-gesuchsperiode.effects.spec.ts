import { TestScheduler } from 'rxjs/testing';

import { GesuchsperiodeService } from '@dv/shared/model/gesuch';

import { loadGesuchsperiodes } from './shared-data-access-gesuchsperiode.effects';
import { sharedDataAccessGesuchsperiodeEvents } from './shared-data-access-gesuchsperiode.events';

describe('sharedDataAccessGesuchsperiode Effects', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('loads Gesuchsperiode effect - success', () => {
    scheduler.run(({ expectObservable, hot, cold }) => {
      const gesuchsperiodeServiceMock = {
        getGesuchsperioden$: () => cold('150ms a', { a: [] }),
      } as unknown as GesuchsperiodeService;

      const actionsMock$ = hot('10ms a', {
        a: sharedDataAccessGesuchsperiodeEvents.init(),
      });

      const effectStream$ = loadGesuchsperiodes(
        actionsMock$,
        gesuchsperiodeServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: sharedDataAccessGesuchsperiodeEvents.gesuchsperiodesLoadedSuccess({
          gesuchsperiodes: [],
        }),
      });
    });
  });
});
