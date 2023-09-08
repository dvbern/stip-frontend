/*
 * Copyright (C) 2023 DV Bern AG, Switzerland
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as fs from 'fs';
import { PathLike } from 'fs';
import childProcess from 'child_process';
import path from 'path';

const yaml = './node_modules/@kibon/stip-contract/openapi.yaml';
const dependencies = require('../package.json').dependencies;

const ngVersion = dependencies['@angular/core'].replace(/[^0-9.]/, '');
console['log']('ngVersion', ngVersion);

function deleteFile(filePath: PathLike) {
  fs.unlinkSync(filePath);
}

function deleteOldFilesSync(directory: string, timestamp: Date) {
  if (!fs.existsSync(directory)) {
    return;
  }

  let files = fs.readdirSync(directory);
  for (const file of files) {
    const filePath = path.join(directory, file);
    const stats = fs.statSync(filePath);
    if (stats.mtime.getTime() < timestamp.getTime()) {
      deleteFile(filePath);
    }
  }
}

function copyFilesForGesuch(directoryFrom: string, directoryTo: string) {
  if (!fs.existsSync(directoryFrom) || !fs.existsSync(directoryTo)) {
    return;
  }

  let files = fs.readdirSync(directoryFrom);
  for (const file of files) {
    const filePath = path.join(directoryFrom, file);
    const filePathTo = path.join(directoryTo, file);
    fs.copyFileSync(filePath, filePathTo);
  }
}

async function generateOpenApi(directory: string, apis: string[]) {
  const env = {
    ...process.env,
    JAVA_OPTS: ['-Dmodels'].join(' '),
  };

  const apisString = apis.join(':');

  //const typesPath = '../../types';
  const typeMap = [
    // [OpenApi-Name/Format, Typescript-Name, Import-Path]
    ['AnyType', 'object', undefined],
    // ['set', 'FakeSet', typesPath],
    ['date', 'string', undefined],
    ['Date', 'string', undefined],
    ['DateTime', 'string', undefined],
    ['iso-date-string', 'IsoDateString', undefined],
    // ['local-time', 'BackendLocalTime', typesPath],
    // ['local-time-hhmm', 'BackendLocalTimeHHMM', typesPath],
    // ['zoned-date-time', 'BackendZonedDateTime', typesPath],
    //  ['email', 'BackendEmail', typesPath],
    // ['rest-includes', 'RestIncludes', typesPath],
    //['entity-id', 'EntityID', typesPath],
  ];
  const typeMappingsArg = typeMap.map((e) => `${e[0]}=${e[1]}`).join(',');
  const importMappingsArg = typeMap
    .filter((e) => !!e[2])
    .map((e) => `${e[1]}=${e[2]}`)
    .join(',');

  const cmd =
    'npx openapi-generator-cli generate' +
    ` -i ${yaml}` +
    ' -g typescript-angular' +
    ' --template-dir scripts/conf/openapi-templates' +
    ` --global-property models,apis=${apisString},supportingFiles` +
    ` -p ngVersion=${ngVersion}` +
    ' -p basePath=/api/v1' +
    ' -p supportsES6=true' +
    ' -p disallowAdditionalPropertiesIfNotPresent=false' +
    ' -p legacyDiscriminatorBehavior=false' +
    // Sortierung: uebernimmt Originalreihenfolge
    ' -p sortModelPropertiesByRequiredFlag=false' +
    ' -p sortParamsByRequiredFlag=false' +
    ' -p enumPropertyNaming=original' +
    // Eindeutiges Naming fuer Service-Methoden und Parameter-Objekte
    ' -p removeOperationIdPrefix=true' +
    ' -p prefixParameterInterfaces=true' +
    // sonst schneidet es bei einigen Enums den vordersten Teil einfach ab, wenn alle Eintraege das gleiche Prefix haben
    ' -p removeEnumValuePrefix=false' +
    ' -p useSingleRequestParameter=true' +
    ` --type-mappings ${typeMappingsArg}` +
    // + ` --import-mappings ${importMappingsArg}`
    ' -o ' +
    directory;

  console['log']('executing command: ', cmd);
  const child = childProcess.exec(cmd, { env });
  child.stdout?.on('data', (data) => {
    console['log'](data.toString());
  });
  child.stderr?.on('data', (data) => {
    console.error(data.toString());
  });

  return new Promise<void>((resolve, reject) => {
    child.on('exit', (code) =>
      code === 0 ? resolve() : reject('exit code: ' + code)
    );
    child.on('error', reject);
  });
}

async function sleep(msec: number) {
  return new Promise((resolve) => setTimeout(resolve, msec));
}

// async main
(async () => {
  const timestamp = new Date();
  // noinspection MagicNumberJS
  await sleep(100); // make sure timestamp ticks

  const generatorPath = 'tmp/generated';
  const apiPath = path.join(generatorPath, 'api');
  const modelsPath = path.join(generatorPath, 'model');

  // add more APIs as you go
  // Keep in mind: there is one file generated per OpenAPI-@Tag,
  // Names are CamelCase versions from OpenAPIConst Tags
  const generatedApis = [
    'Ausbildungsstaette',
    'Benutzer',
    'Configuration',
    'Fall',
    'Gesuch',
    'Gesuchsperiode',
    'Stammdaten',
    'Tenant',
  ];

  await generateOpenApi(generatorPath, generatedApis);

  deleteOldFilesSync(apiPath, timestamp);
  deleteOldFilesSync(modelsPath, timestamp);
  const gesuchModelPath = 'libs/shared/model/gesuch/src/lib/openapi/model';
  const gesuchServicePath = 'libs/shared/model/gesuch/src/lib/openapi/services';
  copyFilesForGesuch(apiPath, gesuchServicePath);
  copyFilesForGesuch(modelsPath, gesuchModelPath);
  // we can generate only a selection of model entities according to namespace for example.
  // That would allow us to split the model directly in the right packages. Lets see if we need it.
})();
