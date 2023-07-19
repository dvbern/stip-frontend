import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { TestScheduler } from 'rxjs/testing';

import { GesuchAppDataAccessAusbildungsstaetteApiEvents } from './gesuch-app-data-access-ausbildungsstaette.events';

import { GesuchAppDataAccessAusbildungsstaetteService } from './gesuch-app-data-access-ausbildungsstaette.service';
import { loadAusbildungsstaettes } from './gesuch-app-data-access-ausbildungsstaette.effects';

describe('GesuchAppDataAccessAusbildungsgang Effects', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('loads Ausbildungsstaette effect - success', () => {
    scheduler.run(({ expectObservable, hot, cold }) => {
      const gesuchAppDataAccessAusbildungsstaetteServiceMock = {
        getAll: () => cold('150ms a', { a: [] }),
      } as unknown as GesuchAppDataAccessAusbildungsstaetteService;

      const eventsMock$ = hot('10ms a', {
        a: GesuchAppEventGesuchFormEducation.init(),
      });

      const effectStream$ = loadAusbildungsstaettes(
        eventsMock$,
        gesuchAppDataAccessAusbildungsstaetteServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: GesuchAppDataAccessAusbildungsstaetteApiEvents.ausbildungsstaettesLoadedSuccess(
          { ausbildungsstaettes: [] }
        ),
      });
    });
  });
});
