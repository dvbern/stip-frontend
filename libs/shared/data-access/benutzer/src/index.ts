export * from './lib/shared-data-access-benutzer.feature';
export * from './lib/shared-data-access-benutzer.events';
export * from './lib/shared-data-access-benutzer.selectors';
export * from './lib/shared-data-access-benutzer.effects';

/**
 * Register only once in:
 * 1. lazy loaded feature (state of feature)
 * 2. app.config.ts (global state of a single app)
 * 3. core (global state re-used in every app)
 *
 * providers: [
 *   provideState(sharedDataAccessBenutzersFeature),
 *   provideEffects(sharedDataAccessBenutzerEffects)
 * ]
 *
 * Search for // TODO and replace placeholder interfaces with real ones from a model lib
 *
 * If you need to access part of the state in multiple features then there are following options
 * 1) move feature registration to app/core (becomes eager and global, any feature can access its state)
 * 2) create a new data-access library which is registered in core and manages subset of original state
 */
