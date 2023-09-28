import task from '@cypress/code-coverage/task';
import { nxComponentTestingPreset } from '@nx/angular/plugins/component-testing';
import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    ...nxComponentTestingPreset(__filename),
    setupNodeEvents(on, config) {
      task(on, config);
      return config;
    },
  },
});
