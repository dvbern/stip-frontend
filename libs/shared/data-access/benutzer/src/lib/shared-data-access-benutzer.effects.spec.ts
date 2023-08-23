import { TestScheduler } from 'rxjs/testing';

import { loadCurrentBenutzer } from './shared-data-access-benutzer.effects';

import { SharedDataAccessBenutzerApiEvents } from './shared-data-access-benutzer.events';
import { BenutzerService } from '@dv/shared/model/gesuch';

describe('SharedDataAccessBenutzer Effects', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('loads Benutzer effect - success', () => {
    scheduler.run(({ expectObservable, hot, cold }) => {
      const benutzerServiceMock = {
        getCurrentBenutzer$: () => cold('150ms a', { a: {} }),
      } as unknown as BenutzerService;

      const eventsMock$ = hot('10ms a', {
        a: SharedDataAccessBenutzerApiEvents.loadCurrentBenutzer(),
      });

      const effectStream$ = loadCurrentBenutzer(
        eventsMock$,
        benutzerServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: SharedDataAccessBenutzerApiEvents.currentBenutzerLoadedSuccess({
          benutzer: {} as any,
        }),
      });
    });
  });
});
