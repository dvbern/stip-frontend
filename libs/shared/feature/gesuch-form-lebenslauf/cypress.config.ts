import { nxComponentTestingPreset } from '@nx/angular/plugins/component-testing';
import task from '@cypress/code-coverage/task';
import { defineConfig } from 'cypress';
import * as path from 'path';

import { setupCoverageWebpack } from './coverage.webpack';

const nxPreset = nxComponentTestingPreset(__filename);

export default defineConfig({
  component: {
    ...nxPreset,
    devServer: {
      ...nxPreset.devServer,
      webpackConfig: setupCoverageWebpack([path.join(__dirname, 'src')]),
    },
    setupNodeEvents(on, config) {
      task(on, config);
      return config;
    },
  },
  scrollBehavior: 'nearest',
});
