import { TestScheduler } from 'rxjs/testing';

import { StammdatenService } from '@dv/shared/model/gesuch';

import { loadStammdatens } from './shared-data-access-stammdaten.effects';
import { SharedDataAccessStammdatenApiEvents } from './shared-data-access-stammdaten.events';

describe('SharedDataAccessStammdaten Effects', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('loads Stammdaten effect - success', () => {
    scheduler.run(({ expectObservable, hot, cold }) => {
      const stammdatenServiceMock = {
        getLaender$: () => cold('150ms a', { a: [] }),
      } as unknown as StammdatenService;

      const eventsMock$ = hot('10ms a', {
        a: SharedDataAccessStammdatenApiEvents.init(),
      });

      const effectStream$ = loadStammdatens(eventsMock$, stammdatenServiceMock);

      expectObservable(effectStream$).toBe('160ms a', {
        a: SharedDataAccessStammdatenApiEvents.stammdatensLoadedSuccess({
          laender: [],
        }),
      });
    });
  });
});
