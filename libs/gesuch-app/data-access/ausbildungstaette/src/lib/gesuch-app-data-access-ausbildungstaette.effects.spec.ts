import { GesuchAppEventGesuchFormEducation } from '@dv/gesuch-app/event/gesuch-form-education';
import { TestScheduler } from 'rxjs/testing';

import { GesuchAppDataAccessAusbildungstaetteApiEvents } from './gesuch-app-data-access-ausbildungstaette.events';

import { GesuchAppDataAccessAusbildungstaetteService } from './gesuch-app-data-access-ausbildungstaette.service';
import { loadAusbildungstaettes } from './gesuch-app-data-access-ausbildungstaette.effects';

describe('GesuchAppDataAccessAusbildungsgang Effects', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('loads Ausbildungstaette effect - success', () => {
    scheduler.run(({ expectObservable, hot, cold }) => {
      const gesuchAppDataAccessAusbildungstaetteServiceMock = {
        getAll: () => cold('150ms a', { a: [] }),
      } as unknown as GesuchAppDataAccessAusbildungstaetteService;

      const eventsMock$ = hot('10ms a', {
        a: GesuchAppEventGesuchFormEducation.init(),
      });

      const effectStream$ = loadAusbildungstaettes(
        eventsMock$,
        gesuchAppDataAccessAusbildungstaetteServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: GesuchAppDataAccessAusbildungstaetteApiEvents.ausbildungstaettesLoadedSuccess(
          { ausbildungstaettes: [] }
        ),
      });
    });
  });
});
