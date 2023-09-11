import { TestScheduler } from 'rxjs/testing';

import { SharedEventGesuchFormEducation } from '@dv/shared/event/gesuch-form-education';
import { AusbildungsstaetteService } from '@dv/shared/model/gesuch';

import { SharedDataAccessAusbildungsstaetteApiEvents } from './shared-data-access-ausbildungsstaette.events';
import { loadAusbildungsstaettes } from './shared-data-access-ausbildungsstaette.effects';

describe('SharedDataAccessAusbildungsgang Effects', () => {
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
        a: SharedEventGesuchFormEducation.init(),
      });

      const effectStream$ = loadAusbildungsstaettes(
        eventsMock$,
        ausbildungsstaetteServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: SharedDataAccessAusbildungsstaetteApiEvents.ausbildungsstaettesLoadedSuccess(
          { ausbildungsstaettes: [] }
        ),
      });
    });
  });
});
