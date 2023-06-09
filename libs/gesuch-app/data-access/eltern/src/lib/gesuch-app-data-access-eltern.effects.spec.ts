import { TestScheduler } from 'rxjs/testing';

import { loadElterns } from './gesuch-app-data-access-eltern.effects';

import { GesuchAppDataAccessElternService } from './gesuch-app-data-access-eltern.service';
import { GesuchAppDataAccessElternApiEvents } from './gesuch-app-data-access-eltern.events';
import { GesuchAppEventGesuchFormEltern } from '@dv/gesuch-app/event/gesuch-form-eltern';

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
        getAllForGesuch: () => cold('150ms a', { a: [] }),
      } as unknown as GesuchAppDataAccessElternService;

      const eventsMock$ = hot('10ms a', {
        a: GesuchAppEventGesuchFormEltern.init(),
      });

      const effectStream$ = loadElterns(
        eventsMock$,
        // TODO Ask Tomas how to inject store to test it
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
