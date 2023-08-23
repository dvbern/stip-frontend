import { TestScheduler } from 'rxjs/testing';

import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';
import { GesuchsperiodeService } from '@dv/shared/model/gesuch';

import { loadGesuchsperiodes } from './gesuch-app-data-access-gesuchsperiode.effects';
import { GesuchAppDataAccessGesuchsperiodeEvents } from './gesuch-app-data-access-gesuchsperiode.events';

describe('GesuchAppDataAccessGesuchsperiode Effects', () => {
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
        a: GesuchAppEventCockpit.init(),
      });

      const effectStream$ = loadGesuchsperiodes(
        actionsMock$,
        gesuchsperiodeServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: GesuchAppDataAccessGesuchsperiodeEvents.gesuchsperiodesLoadedSuccess(
          { gesuchsperiodes: [] }
        ),
      });
    });
  });
});
