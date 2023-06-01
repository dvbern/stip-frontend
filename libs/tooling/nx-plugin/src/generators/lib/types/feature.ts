import path from 'path';
import { Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';

import { NormalizedSchema, LibTypeGenerator } from '../generator.interface';
import { extendEslintJson } from './helpers/eslint';
import { updatePrefix } from './helpers/prefix';

export function featureTypeFactory(
  options: NormalizedSchema
): LibTypeGenerator {
  const { scope } = options;
  return {
    libGenerator: libraryGenerator,
    libDefaultOptions: {
      lazy: true,
      routing: true,
      standalone: true,
      style: 'scss',
      skipTests: true,
      changeDetection: 'OnPush',
      ...(scope !== 'shared'
        ? {
            parent: `apps/${scope}/src/app/app.routes.ts`,
          }
        : {}),
    },
    generators: [],
    postprocess,
  };
}

function postprocess(tree: Tree, options: NormalizedSchema) {
  extendEslintJson(tree, 'angular', options);
  updatePrefix(tree, options);
  tree.delete(
    path.join(options.projectRoot, options.nameDasherized, 'README.md')
  );
}
