import { Tree, updateJson } from '@nx/devkit';
import path from 'path';

export function updatePrefix(
  tree: Tree,
  options: { projectRoot: string; nameDasherized: string; projectName: string }
) {
  updateJson(
    tree,
    path.join(options.projectRoot, options.nameDasherized, 'project.json'),
    (json) => {
      json.prefix = `dv-${options.projectName}`;
      return json;
    }
  );
}
