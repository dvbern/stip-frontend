import { TestScheduler } from 'rxjs/testing';

import { loadElterns } from './gesuch-app-data-access-eltern.effects';

import { GesuchAppDataAccessElternService } from './gesuch-app-data-access-eltern.service';
import { GesuchAppDataAccessElternApiEvents } from './gesuch-app-data-access-eltern.events';

describe('GesuchAppDataAccessEltern Effects', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('loads Eltern effect - success', () => {
    scheduler.run(({ expectObservable, hot, cold }) => {
      const gesuchAppDataAccessElternServiceMock = {
        getAll: () => cold('150ms a', { a: [] }),
      } as unknown as GesuchAppDataAccessElternService;

      const eventsMock$ = hot('10ms a', {
        // TODO replace with a trigger event (eg some page init)
        a: GesuchAppDataAccessElternApiEvents.dummy(),
      });

      const effectStream$ = loadElterns(
        eventsMock$,
        gesuchAppDataAccessElternServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: GesuchAppDataAccessElternApiEvents.elternsLoadedSuccess({
          elterns: [],
        }),
      });
    });
  });
});
