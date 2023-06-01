import { TestScheduler } from 'rxjs/testing';

import { loadGesuchsperiodes } from './gesuch-app-data-access-gesuchsperiode.effects';
import { GesuchAppDataAccessGesuchsperiodeService } from './gesuch-app-data-access-gesuchsperiode.service';
import { GesuchAppDataAccessGesuchsperiodeApiActions } from './gesuch-app-data-access-gesuchsperiode-api.actions';
import { GesuchAppDataAccessGesuchsperiodeCockpitActions } from './gesuch-app-data-access-gesuchsperiode.actions';

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
        a: GesuchAppDataAccessGesuchsperiodeCockpitActions.init(),
      });

      const effectStream$ = loadGesuchsperiodes(
        actionsMock$,
        gesuchAppDataAccessGesuchsperiodeServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: GesuchAppDataAccessGesuchsperiodeApiActions.gesuchsperiodesLoadedSuccess(
          { gesuchsperiodes: [] }
        ),
      });
    });
  });
});
