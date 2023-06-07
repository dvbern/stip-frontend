import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { TestScheduler } from 'rxjs/testing';

import { loadAusbildungsgangs } from './gesuch-app-data-access-ausbildungsgang.effects';
import { GesuchAppDataAccessAusbildungsgangApiEvents } from './gesuch-app-data-access-ausbildungsgang.events';

import { GesuchAppDataAccessAusbildungsgangService } from './gesuch-app-data-access-ausbildungsgang.service';

describe('GesuchAppDataAccessAusbildungsgang Effects', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('loads Ausbildungsgang effect - success', () => {
    scheduler.run(({ expectObservable, hot, cold }) => {
      const gesuchAppDataAccessAusbildungsgangServiceMock = {
        getAll: () => cold('150ms a', { a: [] }),
      } as unknown as GesuchAppDataAccessAusbildungsgangService;

      const eventsMock$ = hot('10ms a', {
        a: GesuchAppEventGesuchFormEducation.init(),
      });

      const effectStream$ = loadAusbildungsgangs(
        eventsMock$,
        gesuchAppDataAccessAusbildungsgangServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: GesuchAppDataAccessAusbildungsgangApiEvents.ausbildungsgangsLoadedSuccess(
          { ausbildungsgangLands: [] }
        ),
      });
    });
  });
});
