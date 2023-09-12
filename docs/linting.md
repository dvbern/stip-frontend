# Linting

## Architecture

> The architecture is validated (linted) and a lot of best practices are enforced with the help of the [Nx enforce module boundaries](https://nx.dev/core-features/enforce-project-boundaries) rule.
> as defined in the `.eslintrc.json` file in the `overrides[0].rules.@nx/enforce-module-boundaries[1].depConstraints` section.

The rules configuration is updated automatically when used `npm run g` (lib) and `npm run g:app` (app) generators.
Besides that it is always a good idea to validate if architecture and module boundaries rules are still
in sync using provided `npm run validate` generator.

This generator will make sure that

- folder structure
- project tags
- enforce module boundaries rules

are all in sync!

The reason why they can go out of sync is when we **move** or **rename** a library or an app.
In that case, we can run `npm run validate -- --fix` which will automatically update project **tags**
based on new folder structure.

Besides that it will print out if there are any conflicts between
folder structure and module boundaries rules. These conflicts than have to be resolved manually
by either renaming folders or adjusting the module boundaries rules in the `.eslintrc.json` file and scopes in `libs/tooling/nx-plugin/src/generators/lib/schema.json`.

That way we can be sure our architecture stays consistent and valid.

## Bundle size

Bundle size is linted with the help of `budgets` which are specified in the `project.json` file of each app.
These budget are evaluated on every build and if the bundle size exceeds the specified limit, the build will fail.
This is useful to prevent bundle size from growing too much, especially when not intended, for example
by incorrect import of a library or a component.

The butget based build errors can be debugged using `npm run analyze:gesuch-app` (or other apps, please add script when adding a new app)
which will provide a view of what was bundled in each bundle to figure out if something was included
by accident or if the budget needs to be adjusted.

## Angular

Angular libs are linted using the default sets specified in

- [plugin:@angular-eslint/recommended](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/src/configs/recommended.json)
- [plugin:@angular-eslint/template/recommended](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/src/configs/recommended.json)

(both of which are referenced through `plugin:@nx/angular` in the `.eslintrc.json` files)

Besides these presets, we also use additional rules specified in the
[.eslintrc-angular.json](.eslintrc-angular.json) file that proved to
be beneficial in our projects.

### Typescript

- [@angular-eslint/prefer-on-push-component-change-detection](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin/docs/rules/prefer-on-push-component-change-detection.md) - use OnPush change detection strategy by default (perf)

### Template

- [@angular-eslint/template/button-has-type](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/button-has-type.md) - prevent accidental form interactions, should be `<button type="button">` in most cases
- [@angular-eslint/template/use-track-by-function](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/use-track-by-function.md) - `*ngFor` performance optimization (easy to add, huge impact)
- [@angular-eslint/template/no-duplicate-attributes](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/no-duplicate-attributes.md) - always incorrect, catch it in complex templates
- [@angular-eslint/template/no-interpolation-in-attributes](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/no-interpolation-in-attributes.md) - use `[prop]` instead (consistency)
- [@angular-eslint/template/no-negated-async](https://github.com/angular-eslint/angular-eslint/blob/main/packages/eslint-plugin-template/docs/rules/no-negated-async.md) - error prone, handle explicitly, eg `(stream$ | async) === false`

This additional file is referenced in the `extends` section of the
individual `.eslintrc.json` files of each library which was generated
using provided `lib` generator.

- [Docs (rules)](https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin/src/rules)
- [Docs (rules template)](https://github.com/angular-eslint/angular-eslint/tree/main/packages/eslint-plugin-template/docs/rules)

## NgRx

NgRx (data-access) libraries are linted using the default sets specified in

- [plugin:@ngrx/eslint-plugin/strict](https://github.com/ngrx/platform/blob/master/modules/eslint-plugin/src/configs/strict.ts)

This additional NgRx config is specified in the
[.eslintrc-ngrx.json](.eslintrc-ngrx.json) file is referenced in the `extends` section of the
individual `.eslintrc.json` files of `data-access` type libraries which was generated
using provided `lib` generator.

- [Docs (rules)](https://ngrx.io/guide/eslint-plugin#rules)
