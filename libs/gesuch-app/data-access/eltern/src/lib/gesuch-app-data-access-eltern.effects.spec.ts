import { TestScheduler } from 'rxjs/testing';
import { createMockStore } from '@ngrx/store/testing';

import { GesuchAppEventGesuchFormEltern } from '@dv/gesuch-app/event/gesuch-form-eltern';

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
        getAllForGesuch: () => cold('150ms a', { a: undefined }),
      } as unknown as GesuchAppDataAccessElternService;

      const eventsMock$ = hot('10ms a', {
        a: GesuchAppEventGesuchFormEltern.init(),
      });

      const effectStream$ = loadElterns(
        eventsMock$,
        createMockStore(),
        gesuchAppDataAccessElternServiceMock
      );

      expectObservable(effectStream$).toBe('---', {
        // a: GesuchAppDataAccessElternApiEvents.elternsLoadedSuccess({
        //   elternContainer: undefined,
        // }),
      });
    });
  });
});
