import path from 'path';
import { Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';

import { NormalizedSchema, LibTypeGenerator } from '../generator.interface';
import { extendEslintJson } from './helpers/eslint';
import { updatePrefix } from './helpers/prefix';

export function patternTypeFactory(
  options: NormalizedSchema
): LibTypeGenerator {
  const { scope } = options;
  return {
    libGenerator: libraryGenerator,
    libDefaultOptions: {
      skipModule: true,
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
