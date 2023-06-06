import chalk from 'chalk';
import * as path from 'path';
import { formatFiles, Tree, readJson, updateJson } from '@nx/devkit';

import { ValidateGeneratorSchema } from './schema';

export interface Project {
  name: string;
  path: string;
}

export interface Result {
  violations: string[];
  fixes: string[];
}

export default async function moduleBoundariesValidate(
  tree: Tree,
  schema: ValidateGeneratorSchema
) {
  const { fix } = schema;
  const projectJsonPaths = [
    ...findFiles(tree, './apps', 'project.json'),
    ...findFiles(tree, './libs', 'project.json'),
  ];
  const projects = projectJsonPaths.map((projectJsonPath) => ({
    name: readJson(tree, projectJsonPath).name,
    path: projectJsonPath,
  }));

  const aggregateViolations = [];
  const aggregateFixes = [];

  for (const project of projects) {
    const result = await validateProjectTagsMatchProjectLocation(
      tree,
      project,
      fix
    );
    const { violations, fixes } = result;
    aggregateFixes.push(...fixes);
    aggregateViolations.push(...violations);
  }

  const boundariesViolation =
    await validateEslintEnforceModuleBoundariesMatchesFolderStructure(tree);
  aggregateViolations.push(...boundariesViolation);

  if (aggregateFixes.filter(Boolean)?.length > 0) {
    console.info(chalk.green.bold(aggregateFixes.join('\n\n'), '\n\n'));
    await formatFiles(tree);
  }
  return () => {
    if (aggregateViolations.filter(Boolean)?.length > 0) {
      if (aggregateFixes.filter(Boolean)?.length > 0) {
        console.log('\n');
      }
      console.error(chalk.red.bold(aggregateViolations.join('\n\n'), '\n\n'));
      throw new Error('Module boundaries validation failed');
    }
  };
}

async function validateProjectTagsMatchProjectLocation(
  tree: Tree,
  project: Project,
  fix = false
): Promise<Result> {
  const violations = [];
  const fixes = [];

  const { name, path: projectPath } = project;
  const [appsOrLibs, scopeOrName, type] = projectPath.split(path.sep);
  const projectJson: any = await readJson(tree, projectPath);
  const tags: string[] = projectJson?.tags ?? [];
  const expectedTags = [];
  if (appsOrLibs === 'apps') {
    if (!scopeOrName.endsWith('-e2e')) {
      expectedTags.push(`type:app`, `scope:${scopeOrName}`);
    }
  }
  if (appsOrLibs === 'libs') {
    expectedTags.push(`scope:${scopeOrName}`);
    expectedTags.push(`type:${type}`);
  }
  const tagsDiff = diff(tags, expectedTags);
  if (JSON.stringify(expectedTags.sort()) !== JSON.stringify(tags.sort())) {
    if (fix) {
      projectJson.tags = expectedTags;
      fixes.push(`${chalk.inverse(
        'FIX'
      )} Project ${name} (${appsOrLibs}) and its project.json was updated with
new tags:      ${chalk.inverse(expectedTags.join(','))}
original tags: ${tags.join(',')}`);
      updateJson(tree, `${projectPath}`, (json) => {
        json.tags = expectedTags;
        return json;
      });
    } else {
      violations.push(`Project ${name} (${appsOrLibs}) has a project.json with tags that do not match its location.
Expected:   ${expectedTags.join(', ')}
Actual:     ${tags.join(', ')}
Difference: ${chalk.inverse(tagsDiff.join(', '))}`);
    }
  }
  return {
    violations,
    fixes,
  };
}

async function validateEslintEnforceModuleBoundariesMatchesFolderStructure(
  tree: Tree
): Promise<string[]> {
  const violations = [];
  const moduleBoundaries = await getModuleBoundaries(tree);
  const relevantBoundaries = moduleBoundaries.filter((item) =>
    ['scope:'].some((prefix) => item.sourceTag.startsWith(prefix))
  );
  const scopes = Array.from(
    new Set(
      relevantBoundaries
        .filter((item) => item.sourceTag.startsWith('scope:'))
        .map((item) => item.sourceTag.split(':')[1])
    )
  ).filter((scope) => scope !== 'tooling');

  const scopesGenerator = readJson(
    tree,
    'libs/tooling/nx-plugin/src/generators/lib/schema.json'
  )
    .properties.scope['x-prompt'].items.map((i) => i.value)
    .sort();
  const scopeApps = getFoldersFromTree(tree, './apps').sort();
  const scopeLibs = getFoldersFromTree(tree, './libs')
    .sort()
    .filter((s) => s !== 'tooling');
  const scopeDirs = Array.from(new Set([...scopeApps, ...scopeLibs])).filter(
    (scope) => !scope.endsWith('-e2e') && scope !== 'tooling'
  );

  const scopeFoldersDiff = diff(scopes, scopeDirs);
  if (scopeFoldersDiff.length) {
    violations.push(`Scopes (.eslintrc.json): ${scopes.join(', ')}
Folder structure:        ${scopeDirs.join(', ')}
Difference:              ${chalk.inverse(scopeFoldersDiff.join(', '))}`);
  }

  const scopeGeneratorDiff = diff(scopes, scopesGenerator);
  if (scopeGeneratorDiff.length) {
    violations.push(`Scopes (.eslintrc.json): ${scopes.join(', ')}
Scopes (lib generator):  ${scopesGenerator.join(', ')}
Difference:              ${chalk.inverse(scopeGeneratorDiff.join(', '))}`);
  }

  const folderGeneratorDiff = diff(scopeDirs, scopesGenerator);
  if (folderGeneratorDiff.length) {
    violations.push(`Scopes (lib generator):  ${scopesGenerator.join(', ')}
Folder structure:        ${scopeDirs.join(', ')}
Difference:              ${chalk.inverse(folderGeneratorDiff.join(', '))}`);
  }

  if (violations.length > 0) {
    violations.unshift(
      `Enforce module boundaries definitions in ".eslintrc.json" are out of sync with the workspace folder structure, please resolve the conflict manually by adjusting rules or removing redundant folders.`
    );
  }
  return violations;
}

async function getModuleBoundaries(tree: Tree) {
  const ENFORCE_MODULE_BOUNDARIES = '@nx/enforce-module-boundaries';
  const eslintJson = await readJson(tree, './.eslintrc.json');
  const boundaries = eslintJson?.overrides.find(
    (o) => o?.rules?.[ENFORCE_MODULE_BOUNDARIES]
  )?.rules?.[ENFORCE_MODULE_BOUNDARIES]?.[1]?.depConstraints;
  if (!boundaries) {
    throw new Error(
      `The definition for eslint rule "'@nrwl/nx/enforce-module-boundaries'" not found in the root .eslintrc.json, it should be the first item in the "overrides" array`
    );
  }
  return boundaries;
}

function getFoldersFromTree(tree: Tree, path: string) {
  const IGNORE = ['.gitkeep'];
  const folders = tree
    .children(path)
    .filter(
      (path) =>
        !IGNORE.some((ignore) => path.includes(ignore)) && !tree.isFile(path)
    );
  return folders;
}

function diff(a: any[], b: any[]) {
  return Array.from(
    new Set(
      a
        .filter((item) => !b.includes(item))
        .concat(b.filter((item) => !a.includes(item)))
    )
  );
}

function findFiles(tree: Tree, directory: string, fileName: string): string[] {
  const foundFiles: string[] = [];

  function searchFiles(dir: string) {
    const files = tree.children(dir);

    for (const file of files) {
      const filePath = path.join(dir, file);

      if (tree.exists(filePath)) {
        if (tree.isFile(filePath)) {
          if (file === fileName) {
            foundFiles.push(filePath);
          }
        } else {
          searchFiles(filePath); // Recursively search subdirectories
        }
      }
    }
  }
  searchFiles(directory);
  return foundFiles;
}
