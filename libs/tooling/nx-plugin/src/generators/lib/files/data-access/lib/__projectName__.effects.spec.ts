import { TestScheduler } from 'rxjs/testing';

import { load<%= classify(name) %>s } from './<%= dasherize(projectName) %>.effects';

import { <%= classify(projectName) %>Service } from './<%= dasherize(projectName) %>.service';
import { <%= classify(projectName) %>Actions } from './<%= dasherize(projectName) %>.actions';
import { <%= classify(projectName) %>ApiActions } from './<%= dasherize(projectName) %>-api.actions';

describe('<%= classify(projectName) %> Effects', () => {
  let scheduler: TestScheduler;

  beforeEach(() => {
    scheduler = new TestScheduler((actual, expected) =>
      expect(actual).toEqual(expected)
    );
  });

  it('loads <%= classify(name) %> effect - success', () => {

    scheduler.run(({ expectObservable, hot, cold }) => {
      const <%= camelize(projectName) %>ServiceMock = {
        getAll: () => cold('150ms a', {a: []}),
      } as unknown as <%= classify(projectName) %>Service;

      const actionsMock$ = hot('10ms a', {
        a: <%= classify(projectName) %>Actions.init(),
      });

      const effectStream$ =  load<%= classify(name) %>s(
        actionsMock$,
        <%= camelize(projectName) %>ServiceMock
      );

      expectObservable(effectStream$).toBe('160ms a', {
        a: <%= classify(projectName) %>ApiActions.<%= camelize(name)  %>sLoadedSuccess({ <%= camelize(name)  %>s: [] })
      });
    });
  });
});
