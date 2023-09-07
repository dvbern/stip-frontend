import { nxComponentTestingPreset } from '@nx/angular/plugins/component-testing';
import { defineConfig } from 'cypress';
import task from '@cypress/code-coverage/task';

const nxPreset = nxComponentTestingPreset(__filename);
export default defineConfig({
  component: {
    ...nxPreset,
    setupNodeEvents(on, config) {
      task(on, config);
      return config;
    },
  },
});
