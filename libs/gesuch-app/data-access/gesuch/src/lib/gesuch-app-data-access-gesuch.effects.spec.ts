import { TestScheduler } from 'rxjs/testing';

import { loadGesuchs } from './gesuch-app-data-access-gesuch.effects';

import { GesuchAppDataAccessGesuchService } from './gesuch-app-data-access-gesuch.service';
import { GesuchAppDataAccessGesuchCockpitActions } from './gesuch-app-data-access-gesuch.actions';
import { GesuchAppDataAccessGesuchApiActions } from './gesuch-app-data-access-gesuch-api.actions';

describe('GesuchAppDataAccessGesuch Effects', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('loads Gesuch effect - success', () => {
    scheduler.run(({ expectObservable, hot, cold }) => {
      const gesuchAppDataAccessGesuchServiceMock = {
        getAll: () => cold('150ms a', { a: [] }),
      } as unknown as GesuchAppDataAccessGesuchService;

      const actionsMock$ = hot('10ms a', {
        a: GesuchAppDataAccessGesuchCockpitActions.init(),
      });

      const effectStream$ = loadGesuchs(
        actionsMock$,
        gesuchAppDataAccessGesuchServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: GesuchAppDataAccessGesuchApiActions.gesuchsLoadedSuccess({
          gesuchs: [],
        }),
      });
    });
  });
});
