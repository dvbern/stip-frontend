import path from 'path';
import { Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/angular/generators';

import { NormalizedSchema, LibTypeGenerator } from '../generator.interface';
import { extendEslintJson } from './helpers/eslint';

export function dataAccessTypeFactory(
  options: NormalizedSchema
): LibTypeGenerator {
  return {
    libGenerator: libraryGenerator,
    libDefaultOptions: { skipModule: true },
    generators: [],
    postprocess,
  };
}

function postprocess(tree: Tree, options: NormalizedSchema) {
  extendEslintJson(tree, 'ngrx', options);
  tree.delete(
    path.join(options.projectRoot, options.nameDasherized, 'README.md')
  );
}
