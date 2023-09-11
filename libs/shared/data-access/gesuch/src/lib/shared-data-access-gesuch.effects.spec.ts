import { TestScheduler } from 'rxjs/testing';
import { Store } from '@ngrx/store';

import { GesuchService } from '@dv/shared/model/gesuch';

import { loadOwnGesuchs } from './shared-data-access-gesuch.effects';
import { SharedDataAccessGesuchEvents } from './shared-data-access-gesuch.events';

describe('sharedDataAccessGesuch Effects', () => {
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
        a: SharedDataAccessGesuchEvents.init(),
      });

      const effectStream$ = loadOwnGesuchs(
        actionsMock$,
        gesuchStoreMock,
        gesuchServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: SharedDataAccessGesuchEvents.gesuchsLoadedSuccess({
          gesuchs: [],
        }),
      });
    });
  });
});
