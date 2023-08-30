import { TestScheduler } from 'rxjs/testing';

import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { AusbildungsstaetteService } from '@dv/shared/model/gesuch';

import { GesuchAppDataAccessAusbildungsstaetteApiEvents } from './gesuch-app-data-access-ausbildungsstaette.events';
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
      const ausbildungsstaetteServiceMock = {
        getAusbildungsstaetten$: () => cold('150ms a', { a: [] }),
      } as unknown as AusbildungsstaetteService;

      const eventsMock$ = hot('10ms a', {
        a: GesuchAppEventGesuchFormEducation.init(),
      });

      const effectStream$ = loadAusbildungsstaettes(
        eventsMock$,
        ausbildungsstaetteServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: GesuchAppDataAccessAusbildungsstaetteApiEvents.ausbildungsstaettesLoadedSuccess(
          { ausbildungsstaettes: [] }
        ),
      });
    });
  });
});
