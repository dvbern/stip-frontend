import path from 'path';
import { Tree } from '@nx/devkit';
import { libraryGenerator } from '@nx/js';

import { LibTypeGenerator, NormalizedSchema } from '../generator.interface';

export function eventTypeFactory(options: NormalizedSchema): LibTypeGenerator {
  return {
    libGenerator: libraryGenerator,
    libDefaultOptions: {
      unitTestRunner: 'none',
    },
    generators: [],
    postprocess,
  };
}

function postprocess(tree: Tree, options: NormalizedSchema) {
  tree.delete(
    path.join(options.projectRoot, options.nameDasherized, 'package.json')
  );
  tree.delete(
    path.join(options.projectRoot, options.nameDasherized, 'README.md')
  );
}
