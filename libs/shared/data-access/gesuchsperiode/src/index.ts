export * from './lib/shared-data-access-gesuchsperiode.feature';
export * from './lib/shared-data-access-gesuchsperiode.selectors';
export * from './lib/shared-data-access-gesuchsperiode.effects';
export * from './lib/shared-data-access-gesuchsperiode.events';

/**
 * Register only once in core (global state) OR lazy loaded feature (state of feature)
 *
 * providers: [
 *   provideState(sharedDataAccessGesuchsperiodesFeature),
 *   provideEffects(sharedDataAccessGesuchsperiodeEffects)
 * ]
 *
 * Search for // TODO and replace placeholder interfaces with real ones from a model lib
 *
 * If you need to access part of the state in multiple features then there are following options
 * 1) move feature registration to core (becomes eager and global, any feature can access its state)
 * 2) create a new data-access library which is registered in core and manages subset of original state
 */
