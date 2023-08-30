import path from 'path';
import { Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';

import { LibTypeGenerator, NormalizedSchema } from '../generator.interface';
import { extendEslintJson } from './helpers/eslint';

export function modelTypeFactory(options: NormalizedSchema): LibTypeGenerator {
  return {
    libGenerator: libraryGenerator,
    libDefaultOptions: {
      bundler: 'none',
      unitTestRunner: 'none',
    },
    generators: [],
    postprocess,
  };
}

function postprocess(tree: Tree, options: NormalizedSchema) {
  extendEslintJson(tree, 'angular', options);
  tree.delete(
    path.join(options.projectRoot, options.nameDasherized, 'README.md')
  );
}
