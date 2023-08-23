import { TestScheduler } from 'rxjs/testing';
import { Store } from '@ngrx/store';

import { GesuchAppEventCockpit } from '@dv/gesuch-app/event/cockpit';
import { GesuchService } from '@dv/shared/model/gesuch';

import { loadGesuchs } from './gesuch-app-data-access-gesuch.effects';
import { GesuchAppDataAccessGesuchEvents } from './gesuch-app-data-access-gesuch.events';

describe('GesuchAppDataAccessGesuch Effects', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('loads Gesuch effect - success', () => {
    scheduler.run(({ expectObservable, hot, cold }) => {
      const gesuchServiceMock = {
        getGesucheForBenutzer$: () => cold('150ms a', { a: [] }),
      } as unknown as GesuchService;
      const gesuchStoreMock = {
        select: () => cold('a', { a: '1234' }),
      } as unknown as Store;

      const actionsMock$ = hot('10ms a', {
        a: GesuchAppEventCockpit.init(),
      });

      const effectStream$ = loadGesuchs(
        actionsMock$,
        gesuchStoreMock,
        gesuchServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: GesuchAppDataAccessGesuchEvents.gesuchsLoadedSuccess({
          gesuchs: [],
        }),
      });
    });
  });
});
