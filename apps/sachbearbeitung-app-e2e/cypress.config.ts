import task from '@cypress/code-coverage/task';
import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';
import { defineConfig } from 'cypress';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__dirname),
    setupNodeEvents(on, config) {
      task(on, config);
      return config;
    },
  },
  env: {
    E2E_USERNAME: process.env['E2E_USERNAME'],
    E2E_PASSWORD: process.env['E2E_PASSWORD'],
  },
  scrollBehavior: 'nearest',
});
