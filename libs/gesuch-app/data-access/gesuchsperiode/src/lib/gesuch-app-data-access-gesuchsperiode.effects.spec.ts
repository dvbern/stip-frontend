import { TestScheduler } from 'rxjs/testing';

import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';

import { loadGesuchsperiodes } from './gesuch-app-data-access-gesuchsperiode.effects';
import { GesuchAppDataAccessGesuchsperiodeService } from './gesuch-app-data-access-gesuchsperiode.service';
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
      const gesuchAppDataAccessGesuchsperiodeServiceMock = {
        getAll: () => cold('150ms a', { a: [] }),
      } as unknown as GesuchAppDataAccessGesuchsperiodeService;

      const actionsMock$ = hot('10ms a', {
        a: GesuchAppEventCockpit.init(),
      });

      const effectStream$ = loadGesuchsperiodes(
        actionsMock$,
        gesuchAppDataAccessGesuchsperiodeServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: GesuchAppDataAccessGesuchsperiodeEvents.gesuchsperiodesLoadedSuccess(
          { gesuchsperiodes: [] }
        ),
      });
    });
  });
});
